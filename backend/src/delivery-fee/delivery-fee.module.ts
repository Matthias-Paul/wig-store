import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryFee } from './entities/delivery-fee.entity';
import { DeliveryFeesService } from './delivery-fee.service';
import { DeliveryFeesController } from './delivery-fee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryFee])],
  providers: [DeliveryFeesService],
  controllers: [DeliveryFeesController],
  exports: [DeliveryFeesService],
})
export class DeliveryFeeModule {}
