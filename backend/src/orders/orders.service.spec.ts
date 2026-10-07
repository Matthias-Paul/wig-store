import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CartsService } from '../carts/carts.service';
import { DeliveryFeesService } from 'src/delivery-fee/delivery-fee.service';
import { OrderStatus } from '../common/enums/order-status.enum';

function createListQueryBuilder(result: { orders: Order[]; total: number }) {
  return {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([result.orders, result.total]),
  };
}

function createVariantUpdateQueryBuilder(affected: number) {
  return {
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected }),
  };
}

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepo: jest.Mocked<
    Pick<Repository<Order>, 'findOne' | 'update' | 'create'>
  >;
  let dataSource: { transaction: jest.Mock };
  let eventEmitter: jest.Mocked<Pick<EventEmitter2, 'emit'>>;
  let cartsService: jest.Mocked<Pick<CartsService, 'getCart' | 'clearCart'>>;
  let deliveryFeesService: jest.Mocked<
    Pick<DeliveryFeesService, 'getFeeForState'>
  >;

  const createOrderDto = {
    recipientName: 'Jane Doe',
    recipientPhone: '+2348000000000',
    recipientEmail: 'jane@test.com',
    shippingAddress: '12 Road',
    shippingCity: 'Lagos',
    shippingState: 'Lagos',
    landmark: 'Near mall',
  };

  beforeEach(async () => {
    orderRepo = {
      findOne: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      create: jest.fn(),
    };
    dataSource = {
      transaction: jest.fn(),
    };
    eventEmitter = { emit: jest.fn() };
    cartsService = {
      getCart: jest.fn(),
      clearCart: jest.fn().mockResolvedValue(undefined),
    };
    deliveryFeesService = {
      getFeeForState: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: orderRepo },
        { provide: DataSource, useValue: dataSource },
        { provide: EventEmitter2, useValue: eventEmitter },
        { provide: CartsService, useValue: cartsService },
        { provide: DeliveryFeesService, useValue: deliveryFeesService },
      ],
    }).compile();

    service = module.get(OrdersService);
  });

  describe('checkout', () => {
    it('throws when cart is empty', async () => {
      cartsService.getCart.mockResolvedValue({ items: [] } as never);

      await expect(service.checkout('user-1', createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(deliveryFeesService.getFeeForState).not.toHaveBeenCalled();
    });

    it('throws ConflictException when stock update affects zero rows', async () => {
      cartsService.getCart.mockResolvedValue({
        items: [
          {
            quantity: 2,
            variant: {
              id: 'var-1',
              length: '12"',
              effectivePrice: 5000,
              product: { name: 'Silk Wig' },
            },
          },
        ],
      } as never);
      deliveryFeesService.getFeeForState.mockResolvedValue({
        fee: 1500,
      } as never);

      const variantQb = createVariantUpdateQueryBuilder(0);
      dataSource.transaction.mockImplementation(async (cb) =>
        cb({
          getRepository: (entity: unknown) => {
            if (entity === ProductVariant) {
              return { createQueryBuilder: () => variantQb };
            }
            return {};
          },
          query: jest.fn(),
        }),
      );

      await expect(service.checkout('user-1', createOrderDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('creates order, clears cart, and emits order.placed', async () => {
      cartsService.getCart.mockResolvedValue({
        items: [
          {
            quantity: 1,
            variant: {
              id: 'var-1',
              length: '14"',
              effectivePrice: 8000,
              product: { name: 'Curly Wig' },
            },
          },
        ],
      } as never);
      deliveryFeesService.getFeeForState.mockResolvedValue({
        fee: 2000,
      } as never);

      const variantQb = createVariantUpdateQueryBuilder(1);
      const orderItemRepo = {
        create: jest.fn((data) => data),
        save: jest.fn().mockResolvedValue(undefined),
      };
      const transactionalOrderRepo = {
        create: jest.fn((data) => ({ ...data, id: 'saved-order-id' })),
        save: jest.fn((order) =>
          Promise.resolve({ ...order, id: 'saved-order-id' }),
        ),
      };

      dataSource.transaction.mockImplementation(async (cb) =>
        cb({
          getRepository: (entity: unknown) => {
            if (entity === ProductVariant) {
              return { createQueryBuilder: () => variantQb };
            }
            if (entity === Order) {
              return transactionalOrderRepo;
            }
            if (entity === OrderItem) {
              return orderItemRepo;
            }
            return {};
          },
          query: jest.fn().mockResolvedValue([{ nextval: '7' }]),
        }),
      );

      const completeOrder = {
        id: 'saved-order-id',
        orderNumber: 'WIG-000007',
        items: [],
      } as Order;
      orderRepo.findOne.mockResolvedValue(completeOrder);

      const result = await service.checkout('user-1', createOrderDto);

      expect(deliveryFeesService.getFeeForState).toHaveBeenCalledWith('Lagos');
      expect(cartsService.clearCart).toHaveBeenCalledWith({ userId: 'user-1' });
      expect(transactionalOrderRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 10000,
          deliveryFee: 2000,
          orderNumber: 'WIG-000007',
          status: OrderStatus.PENDING_PAYMENT,
        }),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'order.placed',
        completeOrder,
      );
      expect(result.message).toContain('Proceed to payment');
      expect(result.order).toBe(completeOrder);
    });
  });

  describe('findMyOrders', () => {
    it('returns paginated orders for user', async () => {
      const orders = [{ id: 'o1' }] as Order[];
      const qb = createListQueryBuilder({ orders, total: 1 });
      orderRepo.createQueryBuilder = jest.fn().mockReturnValue(qb);

      const result = await service.findMyOrders('user-1', {
        page: 1,
        limit: 10,
        status: OrderStatus.PAID,
        search: 'WIG',
      });

      expect(qb.where).toHaveBeenCalledWith('order.user_id = :userId', {
        userId: 'user-1',
      });
      expect(qb.andWhere).toHaveBeenCalledTimes(2);
      expect(result.orders).toBe(orders);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('findAllForAdmin', () => {
    it('returns paginated orders with user relation', async () => {
      const orders = [{ id: 'o1' }] as Order[];
      const qb = createListQueryBuilder({ orders, total: 25 });
      orderRepo.createQueryBuilder = jest.fn().mockReturnValue(qb);

      const result = await service.findAllForAdmin({ page: 2, limit: 10 });

      expect(qb.skip).toHaveBeenCalledWith(10);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNextPage).toBe(true);
    });
  });

  describe('findOne', () => {
    const order = {
      id: 'ord-1',
      user: { id: 'owner-id' },
    } as Order;

    it('throws NotFoundException when missing', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('ord-1', 'user-1', false),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException for non-owner non-admin', async () => {
      orderRepo.findOne.mockResolvedValue(order);

      await expect(
        service.findOne('ord-1', 'other-user', false),
      ).rejects.toThrow(ForbiddenException);
    });

    it('returns order for owner or admin', async () => {
      orderRepo.findOne.mockResolvedValue(order);

      await expect(
        service.findOne('ord-1', 'owner-id', false),
      ).resolves.toBe(order);
      await expect(service.findOne('ord-1', 'any', true)).resolves.toBe(order);
    });
  });

  describe('updateStatus', () => {
    it('rejects invalid status transitions', async () => {
      const existing = {
        id: 'ord-1',
        status: OrderStatus.DELIVERED,
        items: [],
        user: { id: 'u1' },
      } as Order;

      dataSource.transaction.mockImplementation(async (cb) =>
        cb({
          getRepository: () => ({
            findOne: jest.fn().mockResolvedValue(existing),
            save: jest.fn(),
          }),
        }),
      );

      await expect(
        service.updateStatus('ord-1', { status: OrderStatus.PAID }),
      ).rejects.toThrow(ConflictException);
    });

    it('updates status and emits customer notification events', async () => {
      const existing = {
        id: 'ord-1',
        status: OrderStatus.PAID,
        items: [],
        user: { id: 'u1' },
      } as Order;
      const updated = {
        ...existing,
        status: OrderStatus.PROCESSING,
      } as Order;
      const save = jest.fn().mockResolvedValue(updated);

      dataSource.transaction.mockImplementation(async (cb) =>
        cb({
          getRepository: () => ({
            findOne: jest.fn().mockResolvedValue(existing),
            save,
          }),
        }),
      );

      const result = await service.updateStatus('ord-1', {
        status: OrderStatus.PROCESSING,
      });

      expect(result.order.status).toBe(OrderStatus.PROCESSING);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'order.status_updated',
        updated,
      );
    });
  });

  describe('markAsPaid', () => {
    it('transitions order to PAID', async () => {
      const existing = {
        id: 'ord-1',
        status: OrderStatus.PENDING_PAYMENT,
        items: [],
        user: { id: 'u1' },
      } as Order;
      const paid = { ...existing, status: OrderStatus.PAID } as Order;

      dataSource.transaction.mockImplementation(async (cb) =>
        cb({
          getRepository: () => ({
            findOne: jest.fn().mockResolvedValue(existing),
            save: jest.fn().mockResolvedValue(paid),
          }),
        }),
      );

      await expect(service.markAsPaid('ord-1')).resolves.toEqual(paid);
    });
  });

  describe('markAsPaymentFailed', () => {
    it('restores stock and sets PAYMENT_FAILED', async () => {
      const existing = {
        id: 'ord-1',
        status: OrderStatus.PENDING_PAYMENT,
        items: [
          {
            quantity: 2,
            variant: { id: 'var-1', product: { name: 'Wig' } },
          },
        ],
        user: { id: 'u1' },
      } as Order;
      const failed = {
        ...existing,
        status: OrderStatus.PAYMENT_FAILED,
      } as Order;
      const variantQb = createVariantUpdateQueryBuilder(1);

      dataSource.transaction.mockImplementation(async (cb) =>
        cb({
          getRepository: (entity: unknown) => {
            if (entity === ProductVariant) {
              return { createQueryBuilder: () => variantQb };
            }
            return {
              findOne: jest.fn().mockResolvedValue(existing),
              save: jest.fn().mockResolvedValue(failed),
            };
          },
        }),
      );

      await expect(service.markAsPaymentFailed('ord-1')).resolves.toEqual(failed);
      expect(variantQb.execute).toHaveBeenCalled();
    });
  });

  describe('updateReference', () => {
    it('updates paystack reference on order', async () => {
      await service.updateReference('ord-1', 'wig-ref-123');

      expect(orderRepo.update).toHaveBeenCalledWith('ord-1', {
        paystackReference: 'wig-ref-123',
      });
    });
  });
});
