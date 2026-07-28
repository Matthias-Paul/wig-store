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
import cloudinaryConfig from './config/cloudinary.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, cloudinaryConfig],
    }),
    JwtModule.register({}),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('database.url'),
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
        entities: [User, Category, Product, ProductVariant],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
      }),
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    UploadsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthorizeGuard }, // runs first
    { provide: APP_GUARD, useClass: RolesGuard }, // runs second
  ],
})
export class AppModule {}
