import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatus } from '../common/enums/order-status.enum';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrdersQueryDto } from './dtos/get-orders-query.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { CartsService } from '../carts/carts.service';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { User } from '../users/entity/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING_PAYMENT]: [
    OrderStatus.PAID,
    OrderStatus.PAYMENT_FAILED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.REFUNDED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.PAYMENT_FAILED]: [],
  [OrderStatus.REFUNDED]: [],
};

const STOCK_RESTORING_STATUSES = [
  OrderStatus.CANCELLED,
  OrderStatus.PAYMENT_FAILED,
  OrderStatus.REFUNDED,
];

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly cartsService: CartsService,
  ) {}

  async checkout(userId: string, dto: CreateOrderDto) {
    const cart = await this.cartsService.getCart({ userId });

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    const savedOrderId = await this.dataSource.transaction(async (manager) => {
      const variantRepo = manager.getRepository(ProductVariant);
      const orderRepo = manager.getRepository(Order);
      const orderItemRepo = manager.getRepository(OrderItem);

      const orderItemsData: {
        variantId: string;
        quantity: number;
        priceAtPurchase: number;
      }[] = [];
      let totalAmount = 0;

      for (const cartItem of cart.items) {
        const result = await variantRepo
          .createQueryBuilder()
          .update(ProductVariant)
          .set({ stock: () => 'stock - :qty' })
          .where('id = :id', { id: cartItem.variant.id })
          .andWhere('stock >= :qty', { qty: cartItem.quantity })
          .setParameter('qty', cartItem.quantity)
          .execute();

        if (result.affected === 0) {
          throw new ConflictException(
            `"${cartItem.variant.product.name}" (${cartItem.variant.length}-inch ${cartItem.variant.pattern}) no longer has enough stock. Please update your cart.`,
          );
        }

        orderItemsData.push({
          variantId: cartItem.variant.id,
          quantity: cartItem.quantity,
          priceAtPurchase: cartItem.variant.effectivePrice,
        });

        totalAmount += cartItem.variant.effectivePrice * cartItem.quantity;
      }

      const seqResult: { nextval: string }[] = await manager.query(
        `SELECT nextval('order_number_seq') as nextval`,
      );
      const orderNumber = `WIG-${seqResult[0].nextval.padStart(6, '0')}`;

      const order = orderRepo.create({
        user: { id: userId } as User,
        status: OrderStatus.PENDING_PAYMENT,
        totalAmount,
        orderNumber,
        recipientName: dto.recipientName,
        recipientPhone: dto.recipientPhone,
        recipientEmail: dto.recipientEmail,
        shippingAddress: dto.shippingAddress,
        shippingCity: dto.shippingCity,
        shippingState: dto.shippingState,
        landmark: dto.landmark,
      });

      const savedOrder = await orderRepo.save(order);

      for (const itemData of orderItemsData) {
        const orderItem = orderItemRepo.create({
          order: savedOrder,
          variant: { id: itemData.variantId } as ProductVariant,
          quantity: itemData.quantity,
          priceAtPurchase: itemData.priceAtPurchase,
        });
        await orderItemRepo.save(orderItem);
      }

      return savedOrder.id;
    });

    await this.cartsService.clearCart({ userId });

    const completeOrder = await this.orderRepo.findOne({
      where: { id: savedOrderId },
      relations: { items: { variant: { product: true } } },
    });

    return {
      message: 'Order created successfully. Proceed to payment.',
      order: completeOrder,
    };
  }

  async findMyOrders(userId: string, query: GetOrdersQueryDto) {
    const { status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('order.user_id = :userId', { userId });

    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        `(order.recipientName ILIKE :search 
      OR order.paystackReference ILIKE :search
      OR order.orderNumber ILIKE :search)`,
        { search: `%${search}%` },
      );
    }
    const [orders, total] = await qb
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  async findAllForAdmin(query: GetOrdersQueryDto) {
    const { status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.variant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .leftJoinAndSelect('order.user', 'user');

    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        `(order.recipientName ILIKE :search
      OR order.recipientEmail ILIKE :search
      OR order.recipientPhone ILIKE :search
      OR order.paystackReference ILIKE :search
      OR order.orderNumber ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    const [orders, total] = await qb
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  async findOne(orderId: string, userId: string, isAdmin: boolean) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: { items: { variant: { product: true } }, user: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!isAdmin && order.user.id !== userId) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  private async transitionStatus(
    orderId: string,
    newStatus: OrderStatus,
  ): Promise<Order> {
    const updatedOrder = await this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.getRepository(Order);
      const variantRepo = manager.getRepository(ProductVariant);

      const order = await orderRepo.findOne({
        where: { id: orderId },
        relations: { items: { variant: true } },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const allowedNextStatuses = ALLOWED_TRANSITIONS[order.status];

      if (!allowedNextStatuses.includes(newStatus)) {
        throw new ConflictException(
          `Cannot change order status from "${order.status}" to "${newStatus}".`,
        );
      }

      if (STOCK_RESTORING_STATUSES.includes(newStatus)) {
        for (const item of order.items) {
          await variantRepo
            .createQueryBuilder()
            .update(ProductVariant)
            .set({ stock: () => 'stock + :qty' })
            .where('id = :id', { id: item.variant.id })
            .setParameter('qty', item.quantity)
            .execute();
        }
      }

      order.status = newStatus;
      return orderRepo.save(order);
    });

    // Only notify for stages the customer actually cares to track
    const CUSTOMER_NOTIFIABLE_STATUSES = [
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ];

    if (CUSTOMER_NOTIFIABLE_STATUSES.includes(newStatus)) {
      this.eventEmitter.emit('order.status_updated', updatedOrder, newStatus);
    }

    return updatedOrder;
  }
  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const updatedOrder = await this.transitionStatus(orderId, dto.status);
    return {
      message: `Order status updated to ${dto.status} successfully`,
      order: updatedOrder,
    };
  }

  async markAsPaid(orderId: string): Promise<Order> {
    return this.transitionStatus(orderId, OrderStatus.PAID);
  }

  async markAsPaymentFailed(orderId: string): Promise<Order> {
    return this.transitionStatus(orderId, OrderStatus.PAYMENT_FAILED);
  }

  async updateReference(orderId: string, reference: string): Promise<void> {
    await this.orderRepo.update(orderId, { paystackReference: reference });
  }
}
