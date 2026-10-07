import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { DeviceToken } from './entities/device-token.entity';
import { FcmService } from './fcm.service';
import { NotificationType } from 'src/common/enums/notification-type.enum';

const flushPromises = () => new Promise<void>((resolve) => setImmediate(resolve));

describe('NotificationsService', () => {
  let service: NotificationsService;
  let notificationRepo: jest.Mocked<
    Pick<
      Repository<Notification>,
      'create' | 'save' | 'findAndCount' | 'count' | 'update'
    >
  >;
  let deviceTokenRepo: jest.Mocked<
    Pick<
      Repository<DeviceToken>,
      'find' | 'delete' | 'query' | 'remove'
    >
  >;
  let fcmService: { sendToTokens: jest.Mock };

  beforeEach(async () => {
    process.env.FRONTEND_URL = 'https://frontend.test';

    notificationRepo = {
      create: jest.fn((data) => data as Notification),
      save: jest.fn(async (entity) => entity as Notification),
      findAndCount: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    };

    deviceTokenRepo = {
      find: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
      remove: jest.fn(),
    };

    fcmService = {
      sendToTokens: jest.fn().mockResolvedValue({
        successCount: 1,
        failureCount: 0,
        staleTokens: [],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: notificationRepo,
        },
        {
          provide: getRepositoryToken(DeviceToken),
          useValue: deviceTokenRepo,
        },
        { provide: FcmService, useValue: fcmService },
      ],
    }).compile();

    service = module.get(NotificationsService);
  });

  describe('create', () => {
    it('persists notification without push when userId is omitted', async () => {
      await service.create({
        type: NotificationType.PRODUCT_CREATED,
        title: 'New product',
        message: 'Check it out',
      });

      expect(notificationRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user: null,
          type: NotificationType.PRODUCT_CREATED,
        }),
      );
      expect(notificationRepo.save).toHaveBeenCalled();
      expect(deviceTokenRepo.find).not.toHaveBeenCalled();
      expect(fcmService.sendToTokens).not.toHaveBeenCalled();
    });

    it('does not push when user has no device tokens', async () => {
      deviceTokenRepo.find.mockResolvedValue([]);

      await service.create({
        userId: 'user-1',
        type: NotificationType.ORDER_PLACED,
        title: 'Order',
        message: 'Placed',
      });

      expect(deviceTokenRepo.find).toHaveBeenCalledWith({
        where: { user: { id: 'user-1' } },
      });
      expect(fcmService.sendToTokens).not.toHaveBeenCalled();
    });

    it('dispatches push with order link and removes stale tokens', async () => {
      deviceTokenRepo.find.mockResolvedValue([
        { token: 'tok-1' },
        { token: 'tok-2' },
      ] as DeviceToken[]);
      fcmService.sendToTokens.mockResolvedValue({
        successCount: 1,
        failureCount: 1,
        staleTokens: ['tok-2'],
      });

      await service.create({
        userId: 'user-1',
        type: NotificationType.ORDER_PAID,
        title: 'Paid',
        message: 'Thanks',
        relatedOrderId: 'order-99',
      });
      await flushPromises();

      expect(fcmService.sendToTokens).toHaveBeenCalledWith(
        ['tok-1', 'tok-2'],
        'Paid',
        'Thanks',
        'https://frontend.test/orders/order-99',
      );
      expect(deviceTokenRepo.delete).toHaveBeenCalledWith({
        token: In(['tok-2']),
      });
    });

    it('uses product link when relatedProductId is set', async () => {
      deviceTokenRepo.find.mockResolvedValue([{ token: 'tok-1' }] as DeviceToken[]);

      await service.create({
        userId: 'user-1',
        type: NotificationType.PRODUCT_CREATED,
        title: 'New',
        message: 'Item',
        relatedProductId: 'prod-5',
      });
      await flushPromises();

      expect(fcmService.sendToTokens).toHaveBeenCalledWith(
        ['tok-1'],
        'New',
        'Item',
        'https://frontend.test/products/id/prod-5',
      );
    });

    it('logs push errors without throwing', async () => {
      deviceTokenRepo.find.mockResolvedValue([{ token: 'tok-1' }] as DeviceToken[]);
      fcmService.sendToTokens.mockRejectedValue(new Error('FCM error'));

      await expect(
        service.create({
          userId: 'user-1',
          type: NotificationType.ORDER_SHIPPED,
          title: 'Shipped',
          message: 'On the way',
        }),
      ).resolves.toBeUndefined();
      await flushPromises();
    });
  });

  describe('findMyNotifications', () => {
    it('returns paginated notifications and unread count', async () => {
      const notifications = [{ id: 'n1' }] as Notification[];
      notificationRepo.findAndCount.mockResolvedValue([notifications, 25]);
      notificationRepo.count.mockResolvedValue(3);

      const result = await service.findMyNotifications('user-1', {
        page: 2,
        limit: 10,
      });

      expect(notificationRepo.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: 'user-1' } },
        order: { createdAt: 'DESC' },
        skip: 10,
        take: 10,
      });
      expect(result).toEqual({
        notifications,
        unreadCount: 3,
        pagination: {
          total: 25,
          page: 2,
          limit: 10,
          totalPages: 3,
          hasNextPage: true,
        },
      });
    });
  });

  describe('findAllForAdmin', () => {
    it('returns all notifications with pagination', async () => {
      const notifications = [{ id: 'n1' }] as Notification[];
      notificationRepo.findAndCount.mockResolvedValue([notifications, 5]);

      const result = await service.findAllForAdmin({ page: 1, limit: 20 });

      expect(notificationRepo.findAndCount).toHaveBeenCalledWith({
        relations: { user: true },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 20,
      });
      expect(result.pagination.totalPages).toBe(1);
      expect(result.notifications).toBe(notifications);
    });
  });

  describe('markAsRead', () => {
    it('updates notification for the owning user', async () => {
      const result = await service.markAsRead('notif-1', 'user-1');

      expect(notificationRepo.update).toHaveBeenCalledWith(
        { id: 'notif-1', user: { id: 'user-1' } },
        { isRead: true },
      );
      expect(result).toEqual({ message: 'Notification marked as read' });
    });
  });

  describe('registerDeviceToken', () => {
    it('upserts token and prunes extras beyond the limit', async () => {
      const now = Date.now();
      deviceTokenRepo.query.mockResolvedValue(undefined);
      deviceTokenRepo.find.mockResolvedValue([
        { token: 'keep-me', createdAt: new Date(now) },
        { token: 'old-1', createdAt: new Date(now - 3000) },
        { token: 'old-2', createdAt: new Date(now - 2000) },
        { token: 'old-3', createdAt: new Date(now - 1000) },
        { token: 'old-4', createdAt: new Date(now - 500) },
        { token: 'old-5', createdAt: new Date(now - 100) },
      ] as DeviceToken[]);
      deviceTokenRepo.remove.mockResolvedValue([] as DeviceToken[]);

      const result = await service.registerDeviceToken('user-1', 'keep-me');

      expect(deviceTokenRepo.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO device_tokens'),
        ['keep-me', 'user-1'],
      );
      expect(deviceTokenRepo.remove).toHaveBeenCalledWith([
        expect.objectContaining({ token: 'old-1' }),
      ]);
      expect(result).toEqual({
        message: 'Device registered for push notifications',
      });
    });

    it('does not prune when at or below token limit', async () => {
      deviceTokenRepo.query.mockResolvedValue(undefined);
      deviceTokenRepo.find.mockResolvedValue([
        { token: 'a', createdAt: new Date() },
        { token: 'b', createdAt: new Date() },
      ] as DeviceToken[]);

      await service.registerDeviceToken('user-1', 'a');

      expect(deviceTokenRepo.remove).not.toHaveBeenCalled();
    });
  });
});
