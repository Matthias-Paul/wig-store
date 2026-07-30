import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrdersQueryDto } from './dtos/get-orders-query.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@ActiveUser('sub') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.checkout(userId, dto);
  }

  @Get('my')
  findMyOrders(
    @ActiveUser('sub') userId: string,
    @Query() query: GetOrdersQueryDto,
  ) {
    return this.ordersService.findMyOrders(userId, query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @ActiveUser('sub') userId: string,
    @ActiveUser('role') role: UserRole,
  ) {
    return this.ordersService.findOne(id, userId, role === UserRole.ADMIN);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAllForAdmin(@Query() query: GetOrdersQueryDto) {
    return this.ordersService.findAllForAdmin(query);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
