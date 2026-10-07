import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminService } from './admin.service';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { User } from '../users/entity/user.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';

function createSelectQueryBuilder() {
  return {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
    getManyAndCount: jest.fn(),
  };
}

describe('AdminService', () => {
  let service: AdminService;
  let orderRepo: jest.Mocked<
    Pick<
      Repository<Order>,
      'createQueryBuilder' | 'count' | 'find'
    >
  >;
  let productRepo: jest.Mocked<Pick<Repository<Product>, 'count'>>;
  let variantRepo: jest.Mocked<Pick<Repository<ProductVariant>, 'count'>>;
  let userRepo: jest.Mocked<Pick<Repository<User>, 'count' | 'find'>>;
  let paymentRepo: jest.Mocked<Pick<Repository<Payment>, 'createQueryBuilder'>>;

  beforeEach(async () => {
    orderRepo = {
      createQueryBuilder: jest.fn(),
      count: jest.fn(),
      find: jest.fn(),
    };
    productRepo = { count: jest.fn() };
    variantRepo = { count: jest.fn() };
    userRepo = { count: jest.fn(), find: jest.fn() };
    paymentRepo = { createQueryBuilder: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getRepositoryToken(Order), useValue: orderRepo },
        { provide: getRepositoryToken(Product), useValue: productRepo },
        { provide: getRepositoryToken(ProductVariant), useValue: variantRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Payment), useValue: paymentRepo },
      ],
    }).compile();

    service = module.get(AdminService);
  });

  describe('getStats', () => {
    it('aggregates dashboard metrics', async () => {
      const revenueQb = createSelectQueryBuilder();
      revenueQb.getRawOne.mockResolvedValue({ sum: '50000' });
      orderRepo.createQueryBuilder.mockReturnValue(revenueQb as never);
      orderRepo.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(40)
        .mockResolvedValueOnce(5);
      productRepo.count.mockResolvedValue(20);
      userRepo.count.mockResolvedValue(80);
      variantRepo.count.mockResolvedValue(3);

      const result = await service.getStats();

      expect(result).toEqual({
        totalRevenue: 50000,
        totalOrders: 100,
        totalPaidOrders: 40,
        totalProducts: 20,
        totalCustomers: 80,
        lowStockCount: 3,
      });
    });

    it('defaults revenue to zero when sum is null', async () => {
      const revenueQb = createSelectQueryBuilder();
      revenueQb.getRawOne.mockResolvedValue({ sum: null });
      orderRepo.createQueryBuilder.mockReturnValue(revenueQb as never);
      orderRepo.count.mockResolvedValue(0);
      productRepo.count.mockResolvedValue(0);
      userRepo.count.mockResolvedValue(0);
      variantRepo.count.mockResolvedValue(0);

      const result = await service.getStats();
      expect(result.totalRevenue).toBe(0);
    });
  });

  describe('getRecentActivity', () => {
    it('merges and sorts orders and signups', async () => {
      const older = new Date('2024-01-01T10:00:00Z');
      const newer = new Date('2024-01-02T10:00:00Z');
      orderRepo.find.mockResolvedValue([
        {
          id: 'o1',
          recipientName: 'Ada',
          totalAmount: 10000,
          orderNumber: 'WIG-000001',
          status: OrderStatus.PAID,
          createdAt: newer,
        } as Order,
      ]);
      userRepo.find.mockResolvedValue([
        {
          id: 'u1',
          name: 'Bob',
          email: 'bob@test.com',
          createdAt: older,
        } as User,
      ]);

      const result = await service.getRecentActivity(15);

      expect(result.activities).toHaveLength(2);
      expect(result.activities[0].type).toBe('order');
      expect(result.activities[1].type).toBe('signup');
      expect(orderRepo.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 15,
      });
    });
  });

  describe('getRevenueChart', () => {
    it('maps raw rows to chart points', async () => {
      const qb = createSelectQueryBuilder();
      qb.getRawMany.mockResolvedValue([
        { period: '2024-01-01', revenue: '1500', orderCount: '2' },
      ]);
      orderRepo.createQueryBuilder.mockReturnValue(qb as never);

      const result = await service.getRevenueChart('day', 30);

      expect(result.chart).toEqual([
        { period: '2024-01-01', revenue: 1500, orderCount: 2 },
      ]);
      expect(qb.select).toHaveBeenCalledWith(
        "TO_CHAR(order.createdAt, 'YYYY-MM-DD')",
        'period',
      );
    });

    it('uses month format when groupBy is month', async () => {
      const qb = createSelectQueryBuilder();
      qb.getRawMany.mockResolvedValue([]);
      orderRepo.createQueryBuilder.mockReturnValue(qb as never);

      await service.getRevenueChart('month', 60);

      expect(qb.select).toHaveBeenCalledWith(
        "TO_CHAR(order.createdAt, 'YYYY-MM')",
        'period',
      );
    });
  });

  describe('getOrdersByStatus', () => {
    it('fills missing statuses with zero counts', async () => {
      const qb = createSelectQueryBuilder();
      qb.getRawMany.mockResolvedValue([
        { status: OrderStatus.PAID, count: '3' },
      ]);
      orderRepo.createQueryBuilder.mockReturnValue(qb as never);

      const result = await service.getOrdersByStatus();

      const paid = result.breakdown.find((b) => b.status === OrderStatus.PAID);
      const pending = result.breakdown.find(
        (b) => b.status === OrderStatus.PENDING_PAYMENT,
      );
      expect(paid?.count).toBe(3);
      expect(pending?.count).toBe(0);
      expect(result.breakdown).toHaveLength(Object.values(OrderStatus).length);
    });
  });

  describe('getTransactions', () => {
    it('returns paginated transaction summaries', async () => {
      const qb = createSelectQueryBuilder();
      const payment = {
        id: 'p1',
        reference: 'wig-ref',
        status: PaymentStatus.SUCCESS,
        amount: 5000,
        createdAt: new Date(),
        order: {
          id: 'o1',
          orderNumber: 'WIG-000001',
          recipientName: 'Ada',
          recipientEmail: 'ada@test.com',
        },
      } as Payment;
      qb.getManyAndCount.mockResolvedValue([[payment], 1]);
      paymentRepo.createQueryBuilder.mockReturnValue(qb as never);

      const result = await service.getTransactions({
        page: 1,
        limit: 10,
        search: 'wig',
        status: PaymentStatus.SUCCESS,
      });

      expect(result.transactions[0]).toMatchObject({
        id: 'p1',
        reference: 'wig-ref',
        amount: 5000,
        order: { orderNumber: 'WIG-000001' },
      });
      expect(result.pagination.total).toBe(1);
      expect(qb.andWhere).toHaveBeenCalled();
    });
  });
});
