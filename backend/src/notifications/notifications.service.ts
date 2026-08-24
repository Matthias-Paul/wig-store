import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from 'src/common/enums/notification-type.enum';
import { DeviceToken } from './entities/device-token.entity';
import { FcmService } from './fcm.service';
import { GetNotificationsQueryDto } from './dtos/get-notifications-query.dto';

const MAX_TOKENS_PER_USER = 5;

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

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
          ? `${process.env.FRONTEND_URL}/products/id/${params.relatedProductId}`
          : process.env.FRONTEND_URL;
          
      if (tokens.length > 0) {
        void this.dispatchPush(tokens, params.title, params.message, link);
      }
    }
  }

  private async dispatchPush(
    tokens: string[],
    title: string,
    message: string,
    link?: string,
  ): Promise<void> {
    try {
      const { staleTokens } = await this.fcmService.sendToTokens(
        tokens,
        title,
        message,
        link,
      );

      if (staleTokens.length > 0) {
        await this.deviceTokenRepo.delete({ token: In(staleTokens) });
        this.logger.log(`Removed ${staleTokens.length} stale FCM token(s)`);
      }
    } catch (error) {
      this.logger.error(
        'Push dispatch failed',
        error instanceof Error ? error.stack : String(error),
      );
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
    // Login + session both POST the same FCM token at once. A find-then-insert
    // loses that race and hits UQ_... on token. Upsert is safe to retry.
    await this.deviceTokenRepo.query(
      `
      INSERT INTO device_tokens (token, user_id)
      VALUES ($1, $2)
      ON CONFLICT (token) DO UPDATE SET user_id = EXCLUDED.user_id
      `,
      [token, userId],
    );

    await this.pruneExtraTokens(userId, token);

    return { message: 'Device registered for push notifications' };
  }

  private async pruneExtraTokens(
    userId: string,
    keepToken: string,
  ): Promise<void> {
    const tokens = await this.deviceTokenRepo.find({
      where: { user: { id: userId } },
    });

    if (tokens.length <= MAX_TOKENS_PER_USER) return;

    const keep = new Set<string>([keepToken]);
    const others = tokens
      .filter((row) => row.token !== keepToken)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    for (const row of others) {
      if (keep.size >= MAX_TOKENS_PER_USER) break;
      keep.add(row.token);
    }

    const stale = tokens.filter((row) => !keep.has(row.token));
    if (stale.length === 0) return;

    await this.deviceTokenRepo.remove(stale);
    this.logger.log(
      `Pruned ${stale.length} extra FCM token(s) for user ${userId}`,
    );
  }
}
