import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let notificationsService: {
    findMyNotifications: jest.Mock;
    findAllForAdmin: jest.Mock;
    markAsRead: jest.Mock;
    registerDeviceToken: jest.Mock;
  };

  beforeEach(async () => {
    notificationsService = {
      findMyNotifications: jest.fn(),
      findAllForAdmin: jest.fn(),
      markAsRead: jest.fn(),
      registerDeviceToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: notificationsService },
      ],
    }).compile();

    controller = module.get(NotificationsController);
  });

  describe('findMyNotifications', () => {
    it('delegates to the service with user id and query', async () => {
      const query = { page: 1, limit: 20 };
      const expected = { notifications: [], unreadCount: 0, pagination: {} };
      notificationsService.findMyNotifications.mockResolvedValue(expected);

      const result = await controller.findMyNotifications('user-42', query);

      expect(notificationsService.findMyNotifications).toHaveBeenCalledWith(
        'user-42',
        query,
      );
      expect(result).toBe(expected);
    });
  });

  describe('findAllForAdmin', () => {
    it('delegates to the service with query', async () => {
      const query = { page: 2, limit: 10 };
      const expected = { notifications: [], pagination: {} };
      notificationsService.findAllForAdmin.mockResolvedValue(expected);

      const result = await controller.findAllForAdmin(query);

      expect(notificationsService.findAllForAdmin).toHaveBeenCalledWith(query);
      expect(result).toBe(expected);
    });
  });

  describe('markAsRead', () => {
    it('delegates to the service with notification id and user id', async () => {
      const expected = { message: 'Notification marked as read' };
      notificationsService.markAsRead.mockResolvedValue(expected);

      const result = await controller.markAsRead('notif-1', 'user-7');

      expect(notificationsService.markAsRead).toHaveBeenCalledWith(
        'notif-1',
        'user-7',
      );
      expect(result).toBe(expected);
    });
  });

  describe('registerDeviceToken', () => {
    it('delegates to the service with user id and token from body', async () => {
      const expected = { message: 'Device registered for push notifications' };
      notificationsService.registerDeviceToken.mockResolvedValue(expected);

      const result = await controller.registerDeviceToken('user-9', {
        token: 'fcm-token-abc',
      });

      expect(notificationsService.registerDeviceToken).toHaveBeenCalledWith(
        'user-9',
        'fcm-token-abc',
      );
      expect(result).toBe(expected);
    });
  });
});
