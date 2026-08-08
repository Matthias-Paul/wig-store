import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RegisterDeviceTokenDto } from './dtos/device-token.dto';
import { GetNotificationsQueryDto } from './dtos/get-notifications-query.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('my')
  findMyNotifications(
    @ActiveUser('sub') userId: string,
    @Query() query: GetNotificationsQueryDto,
  ) {
    return this.notificationsService.findMyNotifications(userId, query);
  }
 
  @Get()
  @Roles(UserRole.ADMIN)
  findAllForAdmin(@Query() query: GetNotificationsQueryDto) {
    return this.notificationsService.findAllForAdmin(query);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @ActiveUser('sub') userId: string) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Post('device-token')
  registerDeviceToken(
    @ActiveUser('sub') userId: string,
    @Body() dto: RegisterDeviceTokenDto,
  ) {
    return this.notificationsService.registerDeviceToken(userId, dto.token);
  }
}
