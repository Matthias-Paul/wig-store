import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: jest.Mocked<
    Pick<
      AdminService,
      | 'getStats'
      | 'getRecentActivity'
      | 'getRevenueChart'
      | 'getOrdersByStatus'
      | 'getTransactions'
    >
  >;

  beforeEach(async () => {
    service = {
      getStats: jest.fn(),
      getRecentActivity: jest.fn(),
      getRevenueChart: jest.fn(),
      getOrdersByStatus: jest.fn(),
      getTransactions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: service }],
    }).compile();

    controller = module.get(AdminController);
  });

  it('getStats delegates to service', async () => {
    const stats = { totalOrders: 10 };
    service.getStats.mockResolvedValue(stats as never);

    await expect(controller.getStats()).resolves.toBe(stats);
    expect(service.getStats).toHaveBeenCalled();
  });

  it('getRecentActivity delegates to service', async () => {
    const activity = { activities: [] };
    service.getRecentActivity.mockResolvedValue(activity);

    await expect(controller.getRecentActivity()).resolves.toBe(activity);
    expect(service.getRecentActivity).toHaveBeenCalled();
  });

  it('getRevenueChart passes query args', async () => {
    const chart = { chart: [] };
    const query = { groupBy: 'month' as const, days: 90 };
    service.getRevenueChart.mockResolvedValue(chart);

    await expect(controller.getRevenueChart(query)).resolves.toBe(chart);
    expect(service.getRevenueChart).toHaveBeenCalledWith('month', 90);
  });

  it('getOrdersByStatus delegates to service', async () => {
    const breakdown = { breakdown: [] };
    service.getOrdersByStatus.mockResolvedValue(breakdown);

    await expect(controller.getOrdersByStatus()).resolves.toBe(breakdown);
    expect(service.getOrdersByStatus).toHaveBeenCalled();
  });

  it('getTransactions passes query dto', async () => {
    const query = { page: 2, limit: 5, search: 'WIG' };
    const result = { transactions: [], pagination: {} };
    service.getTransactions.mockResolvedValue(result as never);

    await expect(controller.getTransactions(query)).resolves.toBe(result);
    expect(service.getTransactions).toHaveBeenCalledWith(query);
  });
});
