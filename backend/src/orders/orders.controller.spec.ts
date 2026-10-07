import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UserRole } from '../common/enums/user-role.enum';
import { OrderStatus } from '../common/enums/order-status.enum';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<
    Pick<
      OrdersService,
      | 'checkout'
      | 'findMyOrders'
      | 'findOne'
      | 'findAllForAdmin'
      | 'updateStatus'
    >
  >;

  beforeEach(async () => {
    service = {
      checkout: jest.fn(),
      findMyOrders: jest.fn(),
      findOne: jest.fn(),
      findAllForAdmin: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: service }],
    }).compile();

    controller = module.get(OrdersController);
  });

  it('checkout passes userId and dto', async () => {
    const dto = {
      recipientName: 'Jane',
      recipientPhone: '+234800',
      recipientEmail: 'j@example.com',
      shippingAddress: '1 Main',
      shippingCity: 'Lagos',
      shippingState: 'Lagos',
    };
    const result = { message: 'ok', order: {} };
    service.checkout.mockResolvedValue(result as never);

    await expect(controller.checkout('user-1', dto)).resolves.toBe(result);
    expect(service.checkout).toHaveBeenCalledWith('user-1', dto);
  });

  it('findMyOrders passes userId and query', async () => {
    const query = { page: 1, limit: 10 };
    const result = { orders: [], pagination: {} };
    service.findMyOrders.mockResolvedValue(result as never);

    await expect(controller.findMyOrders('user-1', query)).resolves.toBe(result);
    expect(service.findMyOrders).toHaveBeenCalledWith('user-1', query);
  });

  it('findOne passes id, userId, and admin flag', async () => {
    const order = { id: 'ord-1' };
    service.findOne.mockResolvedValue(order as never);

    await expect(
      controller.findOne({ id: 'ord-1' }, 'user-1', UserRole.ADMIN),
    ).resolves.toBe(order);
    expect(service.findOne).toHaveBeenCalledWith('ord-1', 'user-1', true);

    service.findOne.mockClear();
    await controller.findOne({ id: 'ord-1' }, 'user-1', UserRole.CUSTOMER);
    expect(service.findOne).toHaveBeenCalledWith('ord-1', 'user-1', false);
  });

  it('findAllForAdmin passes query', async () => {
    const query = { status: OrderStatus.PAID };
    const result = { orders: [], pagination: {} };
    service.findAllForAdmin.mockResolvedValue(result as never);

    await expect(controller.findAllForAdmin(query)).resolves.toBe(result);
    expect(service.findAllForAdmin).toHaveBeenCalledWith(query);
  });

  it('updateStatus passes id and dto', async () => {
    const dto = { status: OrderStatus.PROCESSING };
    const result = { message: 'updated', order: {} };
    service.updateStatus.mockResolvedValue(result as never);

    await expect(controller.updateStatus({ id: 'ord-1' }, dto)).resolves.toBe(
      result,
    );
    expect(service.updateStatus).toHaveBeenCalledWith('ord-1', dto);
  });
});
