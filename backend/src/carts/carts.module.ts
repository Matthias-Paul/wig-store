import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CartsService } from './carts.service'; 
import { CartsController } from './carts.controller'; 

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, ProductVariant])],
  providers: [CartsService],
  controllers: [CartsController],
  exports: [CartsService],
})
export class CartsModule {} 
