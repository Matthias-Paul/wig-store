import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateVariantDto } from './dtos/create-variant.dto';
import { UpdateVariantDto } from './dtos/update-variant.dto';
import { ProductsService } from './products.service';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
    private readonly productsService: ProductsService, // reused, not reimplemented
  ) {}

  async create(productId: string, dto: CreateVariantDto) {
    const product = await this.productsService.findById(productId);

    const existingSku = await this.variantRepo.findOne({
      where: { sku: dto.sku },
    });
    if (existingSku) {
      throw new ConflictException('A variant with this SKU already exists');
    }

    const variant = this.variantRepo.create({
      ...dto,
      product,
    });

    return this.variantRepo.save(variant);
  }

  async findAllForProduct(productId: string) {
    return this.variantRepo.find({
      where: { product: { id: productId } },
      order: { length: 'ASC' },
    });
  }

  async findOne(productId: string, variantId: string) {
    const variant = await this.variantRepo.findOne({
      where: { id: variantId, product: { id: productId } },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    return variant;
  }

  async update(productId: string, variantId: string, dto: UpdateVariantDto) {
    const variant = await this.findOne(productId, variantId);

    if (dto.sku && dto.sku !== variant.sku) {
      const existingSku = await this.variantRepo.findOne({
        where: { sku: dto.sku },
      });
      if (existingSku) {
        throw new ConflictException('A variant with this SKU already exists');
      }
    }

    Object.assign(variant, dto);
    return this.variantRepo.save(variant);
  }

  async remove(productId: string, variantId: string) {
    const variant = await this.findOne(productId, variantId);
    await this.variantRepo.remove(variant);
  }
}
