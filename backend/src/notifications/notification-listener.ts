import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationsListener {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  @OnEvent('order.placed')
  async handleOrderPlaced(order: Order) {
    await this.notificationsService.create({
      userId: order.user.id,
      type: NotificationType.ORDER_PLACED,
      title: 'Order Placed Successfully',
      message: `Your order #${order.orderNumber} has been successfully placed. We have received your order and recorded your order details.`,
      relatedOrderId: order.id,
    });
  }

  @OnEvent('order.paid')
  async handleOrderPaid(order: Order) {
    await this.notificationsService.create({
      userId: order.user.id,
      type: NotificationType.ORDER_PAID,
      title: 'Payment Confirmed',
      message: `Payment for order #${order.orderNumber} has been successfully received and confirmed. Thank you for your payment.`,
      relatedOrderId: order.id,
    });
  }

  @OnEvent('order.payment_failed')
  async handlePaymentFailed(order: Order) {
    await this.notificationsService.create({
      userId: order.user.id,
      type: NotificationType.PAYMENT_FAILED,
      title: 'Payment Failed',
      message: `We could not process the payment for order #${order.orderNumber}. Please review your payment details and try again.`,
      relatedOrderId: order.id,
    });
  }
  @OnEvent('order.status_updated')
  async handleStatusUpdated(order: Order, status: string) {
    const typeMap: Record<string, NotificationType> = {
      processing: NotificationType.ORDER_PROCESSING,
      shipped: NotificationType.ORDER_SHIPPED,
      delivered: NotificationType.ORDER_DELIVERED,
    };

    const titleMap: Record<string, string> = {
      processing: 'Order Processing',
      shipped: 'Order Shipped',
      delivered: 'Order Delivered',
    };

    const messageMap: Record<string, string> = {
      processing: `Your order #${order.orderNumber} is now being processed. Our team is preparing your order for fulfillment.`,

      shipped: `Your order #${order.orderNumber} has been shipped and is on its way to you. You’ll receive an update once it has been delivered.`,

      delivered: `Your order #${order.orderNumber} has been delivered successfully. We hope you enjoy your purchase. Thank you for shopping with us!`,
    };

    // Ignore statuses that don't have a notification type
    if (!typeMap[status]) return;

    await this.notificationsService.create({
      userId: order.user.id,
      type: typeMap[status],
      title: titleMap[status] ?? 'Order Update',
      message:
        messageMap[status] ??
        `There has been an update to your order #${order.orderNumber}.`,
      relatedOrderId: order.id,
    });
  }
  @OnEvent('product.created')
  async handleProductCreated(product: Product) {
    const users = await this.usersService.findAllForNotification();

    await Promise.all(
      users.map((user) =>
        this.notificationsService.create({
          userId: user.id,
          type: NotificationType.PRODUCT_CREATED,
          title: 'New Product Available',
          message: `"${product.name}" is now available in our store. Explore the latest addition to our collection.`,
          relatedProductId: product.id,
        }),
      ),
    );
  }
}
