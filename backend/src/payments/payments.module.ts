import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaystackService } from './paystack.service';
import { OrdersModule } from 'src/orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), OrdersModule],
  providers: [PaymentsService, PaystackService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
