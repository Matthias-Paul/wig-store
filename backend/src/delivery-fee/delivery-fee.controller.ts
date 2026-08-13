// backend/src/delivery-fees/delivery-fees.controller.ts
import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { DeliveryFeesService } from './delivery-fee.service';
import { UpdateDeliveryFeeDto } from './dtos/update-delivery-fee.dto';
import { AllowAnonymous } from '../common/decorators/allow-anonymous.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('delivery-fee')
export class DeliveryFeesController {
  constructor(private readonly deliveryFeesService: DeliveryFeesService) {}

  @Get()
  @AllowAnonymous()
  async getFee(@Query('state') state?: string) {
    if (!state) {
      throw new BadRequestException('A state query parameter is required');
    }
    return this.deliveryFeesService.getFeeForState(state);
  }

  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.deliveryFeesService.findAll();
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryFeeDto) {
    return this.deliveryFeesService.update(id, dto);
  }
}
