import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entity/user.entity';
import authConfig from './config/auth.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGuard } from './common/guards/authorize.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from './products/products.module';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { ProductVariant } from './products/entities/product-variant.entity';
import { CategoriesModule } from './categories/categories.module';
import { UploadsModule } from './uploads/uploads.module';
import { CartsModule } from './carts/carts.module';
import { Cart } from './carts/entities/cart.entity';
import { CartItem } from './carts/entities/cart-item.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './email/email.module';
import cloudinaryConfig from './config/cloudinary.config';
import paystackConfig from './config/paystack.config';
import brevoConfig from './config/brevo.config';
import { AppController } from './app.controller'; // ← add this
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DeliveryFeeModule } from './delivery-fee/delivery-fee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        cloudinaryConfig,
        paystackConfig,
        brevoConfig,
      ],
    }),
    EventEmitterModule.forRoot(),
    JwtModule.register({}),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('database.url'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
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
        ], 
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    UploadsModule,
    CartsModule,
    OrdersModule,
    PaymentsModule,
    EmailModule,
    AdminModule,
    NotificationsModule,
    DeliveryFeeModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AuthorizeGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
