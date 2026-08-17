import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsListener } from './notification-listener';
import { FcmService } from './fcm.service';
import { DeviceToken } from './entities/device-token.entity';
import { Notification } from './entities/notification.entity';
import { User } from 'src/users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, DeviceToken, User])],
  providers: [NotificationsService, NotificationsListener, FcmService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
