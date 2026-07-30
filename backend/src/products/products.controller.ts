import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductsQueryDto } from './dtos/get-products-query.dto';
import { AllowAnonymous } from '../common/decorators/allow-anonymous.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { UpdateProductStatusDto } from './dtos/update-product-status.dto';
import { SetDiscountDto } from './dtos/set-discount.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @AllowAnonymous()
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  findAllForAdmin(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAllForAdmin(query);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateProductStatusDto) {
    return this.productsService.updateStatus(id, dto);
  }
  
  @Get(':slug')
  @AllowAnonymous()
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/discount')
  @Roles(UserRole.ADMIN)
  setDiscount(@Param('id') id: string, @Body() dto: SetDiscountDto) {
    return this.productsService.setDiscount(id, dto);
  }

  @Delete(':id/discount')
  @Roles(UserRole.ADMIN)
  removeDiscount(@Param('id') id: string) {
    return this.productsService.removeDiscount(id);
  }
}
