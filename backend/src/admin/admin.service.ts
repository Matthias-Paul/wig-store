import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../common/enums/order-status.enum';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { User } from '../users/entity/user.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { GetTransactionsQueryDto } from './dto/get-transactions-query.dto';

const LOW_STOCK_THRESHOLD = 5;

const REVENUE_COUNTING_STATUSES = [
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

const EXCLUDED_FROM_REVENUE = [
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.PAYMENT_FAILED,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
];

export interface ActivityItem {
  type: 'order' | 'signup';
  message: string;
  timestamp: Date;
  metadata: Record<string, string>;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {}

  async getStats() {
    const [
      totalRevenueResult,
      totalOrders,
      totalPaidOrders,
      totalProducts,
      totalCustomers,
      lowStockCount,
      pendingOrdersCount,
    ] = await Promise.all([
      this.orderRepo
        .createQueryBuilder('order')
        .select('SUM(order.totalAmount)', 'sum')
        .where('order.status NOT IN (:...excluded)', {
          excluded: EXCLUDED_FROM_REVENUE,
        })
        .getRawOne<{ sum: string | null }>(),
      this.orderRepo.count(),
      this.orderRepo.count({
        where: { status: In(REVENUE_COUNTING_STATUSES) },
      }),
      this.productRepo.count(),
      this.userRepo.count(),
      this.variantRepo.count({
        where: { stock: LessThanOrEqual(LOW_STOCK_THRESHOLD) },
      }),
      this.orderRepo.count({ where: { status: OrderStatus.PENDING_PAYMENT } }),
    ]);

    return {
      totalRevenue: Number(totalRevenueResult?.sum ?? 0),
      totalOrders,
      totalPaidOrders,
      totalProducts,
      totalCustomers,
      lowStockCount,
      //   pendingOrdersCount,
    };
  }

  async getRecentActivity(limit = 15) {
    const [recentOrders, recentUsers] = await Promise.all([
      this.orderRepo.find({
        order: { createdAt: 'DESC' },
        take: limit,
      }),
      this.userRepo.find({
        order: { createdAt: 'DESC' },
        take: limit,
      }),
    ]);

    const orderActivities: ActivityItem[] = recentOrders.map((order) => ({
      type: 'order',
      message: `${order.recipientName} placed an order of ₦${Number(order.totalAmount).toLocaleString()}`,
      timestamp: order.createdAt,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
      },
    }));

    const signupActivities: ActivityItem[] = recentUsers.map((user) => ({
      type: 'signup',
      message: `${user.name} created an account`,
      timestamp: user.createdAt,
      metadata: {
        userId: user.id,
        email: user.email,
      },
    }));

    const combined = [...orderActivities, ...signupActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return { activities: combined };
  }

  async getRevenueChart(groupBy: 'day' | 'month' = 'day', days = 30) {
    const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';

    const rows = await this.orderRepo
      .createQueryBuilder('order')
      .select(`TO_CHAR(order.createdAt, '${dateFormat}')`, 'period')
      .addSelect('SUM(order.totalAmount)', 'revenue')
      .addSelect('COUNT(*)', 'orderCount')
      .where('order.status NOT IN (:...excluded)', {
        excluded: EXCLUDED_FROM_REVENUE,
      })
      .andWhere(`order.createdAt >= NOW() - INTERVAL '${days} days'`)
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany<{ period: string; revenue: string; orderCount: string }>();

    return {
      chart: rows.map((row) => ({
        period: row.period,
        revenue: Number(row.revenue),
        orderCount: parseInt(row.orderCount, 10),
      })),
    };
  }

  async getOrdersByStatus() {
    const rows = await this.orderRepo
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany<{ status: OrderStatus; count: string }>();

    // Ensure every status appears in the response, even with zero orders,
    // so the frontend chart doesn't have to handle missing categories
    const countsByStatus = rows.reduce(
      (acc, row) => {
        acc[row.status] = parseInt(row.count, 10);
        return acc;
      },
      {} as Record<OrderStatus, number>,
    );

    const breakdown = Object.values(OrderStatus).map((status) => ({
      status,
      count: countsByStatus[status] ?? 0,
    }));

    return { breakdown };
  }

  async getTransactions(query: GetTransactionsQueryDto) {
    const { status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const qb = this.paymentRepo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .select([
        'payment.id',
        'payment.reference',
        'payment.status',
        'payment.amount',
        'payment.createdAt',
        'order.id',
        'order.orderNumber',
        'order.recipientName',
        'order.recipientEmail',
      ]);

    if (status) {
      qb.andWhere('payment.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        `(payment.reference ILIKE :search 
        OR order.orderNumber ILIKE :search 
        OR order.recipientName ILIKE :search)`,
        { search: `%${search}%` },
      );
    }  

    const [payments, total] = await qb
      .orderBy('payment.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const transactions = payments.map((payment) => ({
      id: payment.id,
      reference: payment.reference,
      status: payment.status,
      amount: Number(payment.amount),
      date: payment.createdAt,
      order: {
        id: payment.order.id,
        orderNumber: payment.order.orderNumber,
        recipientName: payment.order.recipientName,
        recipientEmail: payment.order.recipientEmail,
      },
    }));

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }
}
