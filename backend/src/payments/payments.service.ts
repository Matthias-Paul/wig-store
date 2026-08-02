import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { PaystackService } from './paystack.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../common/enums/order-status.enum';
import { randomUUID } from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private readonly paystackService: PaystackService,
    private readonly ordersService: OrdersService,
  ) {}

  async initialize(userId: string, orderId: string) {
    const order = await this.ordersService.findOne(orderId, userId, false);

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException(
        `This order cannot be paid for — current status is "${order.status}".`,
      );
    }

    // Mark any previous unresolved payment attempts for this order as abandoned,
    // so they don't linger in PENDING forever once a new attempt starts
    await this.paymentRepo.update(
      { order: { id: order.id }, status: PaymentStatus.PENDING },
      { status: PaymentStatus.FAILED },
    );

    const reference = `wig-${randomUUID()}`;
    const amountInKobo = Math.round(Number(order.totalAmount) * 100);

    const paystackData = await this.paystackService.initializeTransaction({
      email: order.recipientEmail,
      amountInKobo,
      reference,
      callbackUrl: `${process.env.FRONTEND_URL}/order-confirmation`,
    });

    const payment = this.paymentRepo.create({
      order,
      reference,
      status: PaymentStatus.PENDING,
      amount: order.totalAmount,
    });
    await this.paymentRepo.save(payment);

    await this.ordersService.updateReference(order.id, reference);

    return {
      message: 'Payment initialized',
      authorizationUrl: paystackData.authorization_url,
      reference,
    };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const isValid = this.paystackService.verifyWebhookSignature(
      rawBody,
      signature,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    const reference = event.data?.reference;

    if (!reference) {
      throw new BadRequestException('Webhook payload missing reference');
    }

    const existingPayment = await this.paymentRepo.findOne({
      where: { reference },
      relations: { order: true },
    });

    if (!existingPayment) {
      throw new NotFoundException(
        'No matching payment record for this reference',
      );
    }

    // Idempotency check — don't reprocess an already-finalized payment
    if (existingPayment.status !== PaymentStatus.PENDING) {
      return { message: 'Event already processed' };
    }

    // Double-check with Paystack directly, don't just trust the webhook payload
    const verified = await this.paystackService.verifyTransaction(reference);

    existingPayment.rawPayload = event;

    if (verified.status === 'success') {
      existingPayment.status = PaymentStatus.SUCCESS;
      await this.paymentRepo.save(existingPayment);
      await this.ordersService.markAsPaid(existingPayment.order.id);
    } else {
      existingPayment.status = PaymentStatus.FAILED;
      await this.paymentRepo.save(existingPayment);
      await this.ordersService.markAsPaymentFailed(existingPayment.order.id);
    }

    return { message: 'Webhook processed successfully' };
  }

  async checkStatus(userId: string, orderId: string) {
    const order = await this.ordersService.findOne(orderId, userId, false);
    return {
      orderId: order.id,
      status: order.status,
      paystackReference: order.paystackReference,
    };
  }
}
