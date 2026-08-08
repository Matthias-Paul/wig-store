import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from './notifications.service';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { NotificationType } from 'src/common/enums/notification-type.enum';

@Injectable()
export class NotificationsListener {
  constructor(private readonly notificationsService: NotificationsService) {}

  @OnEvent('order.placed')
  async handleOrderPlaced(order: Order) {
    await this.notificationsService.create({
      userId: order.user.id,
      type: NotificationType.ORDER_PLACED,
      title: 'Order Placed',
      message: `Your order ${order.orderNumber} has been placed successfully.`,
      relatedOrderId: order.id,
    });
  }

  @OnEvent('order.paid')
  async handleOrderPaid(order: Order) {
    await this.notificationsService.create({
      userId: order.user.id,
      type: NotificationType.ORDER_PAID,
      title: 'Payment Confirmed',
      message: `Payment for order ${order.orderNumber} was successful.`,
      relatedOrderId: order.id,
    });
  }

  @OnEvent('order.payment_failed')
  async handlePaymentFailed(order: Order) {
    await this.notificationsService.create({
      userId: order.user.id,
      type: NotificationType.PAYMENT_FAILED,
      title: 'Payment Failed',
      message: `Payment for order ${order.orderNumber} could not be processed.`,
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

    await this.notificationsService.create({
      userId: order.user.id,
      type: typeMap[status],
      title: titleMap[status] ?? 'Order Update',
      message: `Order ${order.orderNumber} is now ${status}.`,
      relatedOrderId: order.id,
    });
  }

  @OnEvent('product.created')
  async handleProductCreated(product: Product) {
    await this.notificationsService.create({
      // no userId — this is an admin/system-facing notification
      type: NotificationType.PRODUCT_CREATED,
      title: 'New Product Created',
      message: `"${product.name}" was added to the catalog.`,
      relatedProductId: product.id,
    });
  }
}
