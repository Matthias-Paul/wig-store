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
import { OrderIdParamDto } from './dtos/get-orderId-param.dto';

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
    @Param() param: OrderIdParamDto,
    @ActiveUser('sub') userId: string,
    @ActiveUser('role') role: UserRole,
  ) {
    return this.ordersService.findOne(
      param.id,
      userId,
      role === UserRole.ADMIN,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAllForAdmin(@Query() query: GetOrdersQueryDto) {
    return this.ordersService.findAllForAdmin(query);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param() param: OrderIdParamDto,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(param.id, dto);
  }
} 
