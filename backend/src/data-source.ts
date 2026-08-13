import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entity/user.entity';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { ProductVariant } from './products/entities/product-variant.entity';
import { Cart } from './carts/entities/cart.entity';
import { CartItem } from './carts/entities/cart-item.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Payment } from './payments/entities/payment.entity';
import { Notification } from './notifications/entities/notification.entity';
import { DeviceToken } from './notifications/entities/device-token.entity';
import { DeliveryFee } from './delivery-fee/entities/delivery-fee.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    User,
    Category,
    Product,
    ProductVariant,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
    Notification,
    DeviceToken,
    DeliveryFee
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
