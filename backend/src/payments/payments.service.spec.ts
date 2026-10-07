import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { PaystackService } from './paystack.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';
import { Order } from '../orders/entities/order.entity';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentRepo: jest.Mocked<
    Pick<Repository<Payment>, 'update' | 'create' | 'save' | 'findOne'>
  >;
  let paystackService: jest.Mocked<
    Pick<
      PaystackService,
      'initializeTransaction' | 'verifyWebhookSignature' | 'verifyTransaction'
    >
  >;
  let ordersService: jest.Mocked<
    Pick<
      OrdersService,
      'findOne' | 'updateReference' | 'markAsPaid' | 'markAsPaymentFailed'
    >
  >;
  let eventEmitter: jest.Mocked<Pick<EventEmitter2, 'emit'>>;

  const pendingOrder = {
    id: 'ord-1',
    status: OrderStatus.PENDING_PAYMENT,
    totalAmount: 15000,
    recipientEmail: 'buyer@test.com',
  } as Order;

  beforeEach(async () => {
    paymentRepo = {
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn((data) => data as Payment),
      save: jest.fn((p) => Promise.resolve(p as Payment)),
      findOne: jest.fn(),
    };
    paystackService = {
      initializeTransaction: jest.fn(),
      verifyWebhookSignature: jest.fn(),
      verifyTransaction: jest.fn(),
    };
    ordersService = {
      findOne: jest.fn(),
      updateReference: jest.fn(),
      markAsPaid: jest.fn(),
      markAsPaymentFailed: jest.fn(),
    };
    eventEmitter = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: getRepositoryToken(Payment), useValue: paymentRepo },
        { provide: PaystackService, useValue: paystackService },
        { provide: OrdersService, useValue: ordersService },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get(PaymentsService);
    process.env.FRONTEND_URL = 'https://frontend.test';
  });

  describe('initialize', () => {
    it('initializes Paystack payment for pending order', async () => {
      ordersService.findOne.mockResolvedValue(pendingOrder);
      paystackService.initializeTransaction.mockResolvedValue({
        authorization_url: 'https://paystack.test/pay',
        access_code: 'ac',
        reference: 'ignored',
      });

      const result = await service.initialize('user-1', 'ord-1');

      expect(ordersService.findOne).toHaveBeenCalledWith('ord-1', 'user-1', false);
      expect(paymentRepo.update).toHaveBeenCalledWith(
        { order: { id: 'ord-1' }, status: PaymentStatus.PENDING },
        { status: PaymentStatus.FAILED },
      );
      expect(paystackService.initializeTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'buyer@test.com',
          amountInKobo: 1500000,
          callbackUrl: 'https://frontend.test/order-confirmation',
        }),
      );
      expect(ordersService.updateReference).toHaveBeenCalledWith(
        'ord-1',
        expect.stringMatching(/^wig-/),
      );
      expect(result.message).toBe('Payment initialized');
      expect(result.authorizationUrl).toBe('https://paystack.test/pay');
      expect(result.reference).toMatch(/^wig-/);
    });

    it('rejects non-pending orders', async () => {
      ordersService.findOne.mockResolvedValue({
        ...pendingOrder,
        status: OrderStatus.PAID,
      } as Order);

      await expect(service.initialize('user-1', 'ord-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('handleWebhook', () => {
    const reference = 'wig-webhook-ref';
    const rawBody = Buffer.from(
      JSON.stringify({ data: { reference } }),
      'utf8',
    );

    it('rejects invalid signature', async () => {
      paystackService.verifyWebhookSignature.mockReturnValue(false);

      await expect(
        service.handleWebhook(rawBody, 'bad-sig'),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects payload without reference', async () => {
      paystackService.verifyWebhookSignature.mockReturnValue(true);
      const body = Buffer.from('{}', 'utf8');

      await expect(service.handleWebhook(body, 'sig')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws when payment record missing', async () => {
      paystackService.verifyWebhookSignature.mockReturnValue(true);
      paymentRepo.findOne.mockResolvedValue(null);

      await expect(service.handleWebhook(rawBody, 'sig')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns early when payment already finalized', async () => {
      paystackService.verifyWebhookSignature.mockReturnValue(true);
      paymentRepo.findOne.mockResolvedValue({
        reference,
        status: PaymentStatus.SUCCESS,
        order: pendingOrder,
      } as Payment);

      await expect(service.handleWebhook(rawBody, 'sig')).resolves.toEqual({
        message: 'Event already processed',
      });
      expect(paystackService.verifyTransaction).not.toHaveBeenCalled();
    });

    it('marks order paid on successful verification', async () => {
      paystackService.verifyWebhookSignature.mockReturnValue(true);
      const payment = {
        reference,
        status: PaymentStatus.PENDING,
        order: pendingOrder,
      } as Payment;
      paymentRepo.findOne.mockResolvedValue(payment);
      paystackService.verifyTransaction.mockResolvedValue({
        status: 'success',
        reference,
        amount: 1500000,
        gateway_response: 'Successful',
      });
      const paidOrder = { ...pendingOrder, status: OrderStatus.PAID } as Order;
      ordersService.markAsPaid.mockResolvedValue(paidOrder);

      const result = await service.handleWebhook(rawBody, 'sig');

      expect(payment.status).toBe(PaymentStatus.SUCCESS);
      expect(paymentRepo.save).toHaveBeenCalledWith(payment);
      expect(ordersService.markAsPaid).toHaveBeenCalledWith('ord-1');
      expect(eventEmitter.emit).toHaveBeenCalledWith('order.paid', paidOrder);
      expect(result.message).toBe('Webhook processed successfully');
    });

    it('marks order failed when verification is not success', async () => {
      paystackService.verifyWebhookSignature.mockReturnValue(true);
      const payment = {
        reference,
        status: PaymentStatus.PENDING,
        order: pendingOrder,
      } as Payment;
      paymentRepo.findOne.mockResolvedValue(payment);
      paystackService.verifyTransaction.mockResolvedValue({
        status: 'failed',
        reference,
        amount: 0,
        gateway_response: 'Declined',
      });
      const failedOrder = {
        ...pendingOrder,
        status: OrderStatus.PAYMENT_FAILED,
      } as Order;
      ordersService.markAsPaymentFailed.mockResolvedValue(failedOrder);

      await service.handleWebhook(rawBody, 'sig');

      expect(payment.status).toBe(PaymentStatus.FAILED);
      expect(ordersService.markAsPaymentFailed).toHaveBeenCalledWith('ord-1');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'order.payment_failed',
        failedOrder,
      );
    });
  });

  describe('checkStatus', () => {
    it('returns order payment fields', async () => {
      ordersService.findOne.mockResolvedValue({
        id: 'ord-1',
        status: OrderStatus.PAID,
        paystackReference: 'wig-ref',
      } as Order);

      await expect(service.checkStatus('user-1', 'ord-1')).resolves.toEqual({
        orderId: 'ord-1',
        status: OrderStatus.PAID,
        paystackReference: 'wig-ref',
      });
    });
  });
});
