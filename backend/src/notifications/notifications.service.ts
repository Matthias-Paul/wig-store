import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { DeviceToken } from './entities/device-token.entity';
import { FcmService } from './fcm.service';
import { GetNotificationsQueryDto } from './dtos/get-notifications-query.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(DeviceToken)
    private deviceTokenRepo: Repository<DeviceToken>,
    private readonly fcmService: FcmService,
  ) {}
  async create(params: {
    userId?: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedOrderId?: string;
    relatedProductId?: string;
  }): Promise<void> {
    const notification = this.notificationRepo.create({
      user: params.userId ? ({ id: params.userId } as any) : null,
      type: params.type,
      title: params.title,
      message: params.message,
      relatedOrderId: params.relatedOrderId,
      relatedProductId: params.relatedProductId,
    });

    await this.notificationRepo.save(notification);

    if (params.userId) {
      const deviceTokens = await this.deviceTokenRepo.find({
        where: { user: { id: params.userId } },
      });

      const tokens = deviceTokens.map((dt) => dt.token);

      const link = params.relatedOrderId
        ? `${process.env.FRONTEND_URL}/orders/${params.relatedOrderId}`
        : params.relatedProductId
          ? `${process.env.FRONTEND_URL}/products/${params.relatedProductId}`
          : process.env.FRONTEND_URL;
          
      if (tokens.length > 0) {
        await this.fcmService.sendToTokens(
          tokens,
          params.title,
          params.message,
          link,
        );
      }
    }
  }

  async findMyNotifications(userId: string, query: GetNotificationsQueryDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [notifications, total] = await this.notificationRepo.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const unreadCount = await this.notificationRepo.count({
      where: { user: { id: userId }, isRead: false },
    });

    return {
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  async findAllForAdmin(query: GetNotificationsQueryDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [notifications, total] = await this.notificationRepo.findAndCount({
      relations: { user: true }, // no `where` — admin sees everything
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    await this.notificationRepo.update(
      { id: notificationId, user: { id: userId } },
      { isRead: true },
    );
    return { message: 'Notification marked as read' };
  }

  async registerDeviceToken(userId: string, token: string) {
    const existing = await this.deviceTokenRepo.findOne({ where: { token } });

    if (existing) {
      existing.user = { id: userId } as any;
      await this.deviceTokenRepo.save(existing);
    } else {
      const deviceToken = this.deviceTokenRepo.create({
        user: { id: userId } as any,
        token,
      });
      await this.deviceTokenRepo.save(deviceToken);
    }

    return { message: 'Device registered for push notifications' };
  }
}
