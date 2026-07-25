import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dtos/create-variant.dto';
import { UpdateVariantDto } from './dtos/update-variant.dto';
import { AllowAnonymous } from '../common/decorators/allow-anonymous.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('products/:productId/variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get()
  @AllowAnonymous()
  findAll(@Param('productId') productId: string) {
    return this.variantsService.findAllForProduct(productId);
  }

  @Get(':variantId')
  @AllowAnonymous()
  findOne(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.variantsService.findOne(productId, variantId);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Param('productId') productId: string, @Body() dto: CreateVariantDto) {
    return this.variantsService.create(productId, dto);
  }

  @Patch(':variantId')
  @Roles(UserRole.ADMIN)
  update(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.variantsService.update(productId, variantId, dto);
  }

  @Delete(':variantId')
  @Roles(UserRole.ADMIN)
  remove(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.variantsService.remove(productId, variantId);
  }
}
