import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CartsModule } from '../carts/carts.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DeliveryFeeModule } from 'src/delivery-fee/delivery-fee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, ProductVariant]),
    CartsModule, 
    DeliveryFeeModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
