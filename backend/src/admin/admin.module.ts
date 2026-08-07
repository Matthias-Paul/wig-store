import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { User } from '../users/entity/user.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Payment } from 'src/payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, ProductVariant, User, Payment]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
