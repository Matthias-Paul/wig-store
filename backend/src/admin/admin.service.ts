import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../common/enums/order-status.enum';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { User } from '../users/entity/user.entity';

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

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
    @InjectRepository(User) private userRepo: Repository<User>,
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
}
  