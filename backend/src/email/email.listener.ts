import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email.service';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class EmailListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('order.paid')
  async handleOrderPaid(order: Order) {
    await this.emailService.sendOrderConfirmation(order);
    await this.emailService.sendAdminNewOrderAlert(order);
  }

  @OnEvent('order.payment_failed')
  async handlePaymentFailed(order: Order) {
    await this.emailService.sendPaymentFailedNotice(order);
  }

  @OnEvent('order.status_updated')
  async handleStatusUpdated(order: Order, status: string) {
    await this.emailService.sendOrderStatusUpdate(order, status);
  }

  @OnEvent('user.registered')
  async handleUserRegistered(payload: { name: string; email: string }) {
    await this.emailService.sendWelcomeEmail(payload.name, payload.email);
  }
}
