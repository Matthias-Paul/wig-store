import { Controller, Post, Body, Headers, Req, Param, Get } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { AllowAnonymous } from '../common/decorators/allow-anonymous.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  initialize(
    @ActiveUser('sub') userId: string,
    @Body() dto: InitializePaymentDto,
  ) {
    return this.paymentsService.initialize(userId, dto.orderId);
  }

  @Post('webhook')
  @AllowAnonymous()
  handleWebhook(
    @Req() req: Request,
    @Headers('x-paystack-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(req.body as Buffer, signature);
  }

  @Get(':orderId/status')
  checkStatus(
    @ActiveUser('sub') userId: string,
    @Param() dto: InitializePaymentDto,
  ) {
    return this.paymentsService.checkStatus(userId, dto.orderId);
  }
}
