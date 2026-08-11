import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateVariantDto } from './dtos/create-variant.dto';
import { UpdateVariantDto } from './dtos/update-variant.dto';
import { ProductsService } from './products.service';
import { generateSku } from 'src/common/utils/generate-sku';
import { ProductStatus } from 'src/common/enums/product-status.enum';

const CATEGORIES_REQUIRING_LACE_TYPE = ['luxury-hairs', 'hair-bundles']; // by slug

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
    private readonly productsService: ProductsService,
  ) {}

  async create(productId: string, dto: CreateVariantDto) {
    const product = await this.productsService.findById(productId);

    const categoryRequiresLaceType = CATEGORIES_REQUIRING_LACE_TYPE.includes(
      product.category.slug,
    );

    if (categoryRequiresLaceType && !dto.laceType) {
      throw new BadRequestException(
        `Lace type is required for products in the "${product.category.name}" category.`,
      );
    }

    const existingVariant = await this.variantRepo.findOne({
      where: {
        product: { id: productId },
        length: dto.length,
        color: dto.color,
        closureSize: dto.closureSize,
      },
    });

    if (existingVariant) {
      throw new ConflictException(
        `This product already has a ${dto.length}-inch, ${dto.color}${dto.closureSize ? `, ${dto.closureSize}` : ''} variant.`,
      );
    }

    let sku = generateSku(product.name, dto.length, dto.color);

    let existingSku = await this.variantRepo.findOne({ where: { sku } });
    let attempt = 1;

    while (existingSku) {
      sku = `${generateSku(product.name, dto.length, dto.color)}-${attempt}`;
      existingSku = await this.variantRepo.findOne({ where: { sku } });
      attempt++;
    }

    const variant = this.variantRepo.create({
      ...dto,
      sku,
      product,
    });

    const savedVariant = await this.variantRepo.save(variant);
    const updatedProduct = await this.productsService.findById(productId);

    return {
      message: 'Variant created successfully',
      variant: {
        id: savedVariant.id,
        length: savedVariant.length,
        color: savedVariant.color,
        laceType: savedVariant.laceType,
        closureSize: savedVariant.closureSize,
        sku: savedVariant.sku,
        price: savedVariant.price,
        stock: savedVariant.stock,
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          slug: updatedProduct.slug,
          description: updatedProduct.description,
          images: updatedProduct.images,
          status: updatedProduct.status,
          category: updatedProduct.category,
          variants: updatedProduct.variants,
        },
      },
    };
  }

  async findAllForProduct(productId: string) {
    const variants = await this.variantRepo.find({
      where: { product: { id: productId } },
      order: { length: 'ASC' },
    });

    return {
      message: 'Variants retrieved successfully',
      variants,
    };
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
    const product = await this.productsService.findById(productId);

    const categoryRequiresLaceType = CATEGORIES_REQUIRING_LACE_TYPE.includes(
      product.category.slug,
    );

    const newLaceType =
      dto.laceType !== undefined ? dto.laceType : variant.laceType;

    if (categoryRequiresLaceType && !newLaceType) {
      throw new BadRequestException(
        `Lace type is required for products in the "${product.category.name}" category.`,
      );
    }

    const lengthChanged =
      dto.length !== undefined && dto.length !== variant.length;
    const colorChanged = dto.color !== undefined && dto.color !== variant.color;
    const closureSizeChanged =
      dto.closureSize !== undefined && dto.closureSize !== variant.closureSize;

    if (lengthChanged || colorChanged || closureSizeChanged) {
      const newLength = dto.length ?? variant.length;
      const newColor = dto.color ?? variant.color;
      const newClosureSize = dto.closureSize ?? variant.closureSize;

      const duplicate = await this.variantRepo.findOne({
        where: {
          product: { id: productId },
          length: newLength,
          color: newColor,
          closureSize: newClosureSize,
        },
      });

      if (duplicate && duplicate.id !== variant.id) {
        throw new ConflictException(
          `This product already has a ${newLength}-inch, ${newColor}${newClosureSize ? `, ${newClosureSize}` : ''} variant.`,
        );
      }
    }

    Object.assign(variant, dto);

    if (lengthChanged || colorChanged) {
      let newSku = generateSku(product.name, variant.length, variant.color);

      let existingSku = await this.variantRepo.findOne({
        where: { sku: newSku },
      });
      let attempt = 1;

      while (existingSku && existingSku.id !== variant.id) {
        newSku = `${generateSku(product.name, variant.length, variant.color)}-${attempt}`;
        existingSku = await this.variantRepo.findOne({
          where: { sku: newSku },
        });
        attempt++;
      }

      variant.sku = newSku;
    }

    const updatedVariant = await this.variantRepo.save(variant);
    const updatedProduct = await this.productsService.findById(productId);

    return {
      message: 'Variant updated successfully',
      variant: {
        id: updatedVariant.id,
        length: updatedVariant.length,
        color: updatedVariant.color,
        laceType: updatedVariant.laceType,
        closureSize: updatedVariant.closureSize,
        sku: updatedVariant.sku,
        price: updatedVariant.price,
        stock: updatedVariant.stock,
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          slug: updatedProduct.slug,
          description: updatedProduct.description,
          images: updatedProduct.images,
          status: updatedProduct.status,
          category: updatedProduct.category,
          variants: updatedProduct.variants,
        },
      },
    };
  }

  async remove(productId: string, variantId: string) {
    const variant = await this.findOne(productId, variantId);

    const totalVariants = await this.variantRepo.count({
      where: { product: { id: productId } },
    });

    if (totalVariants === 1) {
      const product = await this.productsService.findById(productId);

      if (product.status === ProductStatus.PUBLISHED) {
        throw new ConflictException(
          'Cannot delete the last variant of a published product. Unpublish the product first, or add another variant before deleting this one.',
        );
      }
    }

    await this.variantRepo.remove(variant);

    return {
      message: 'Variant deleted successfully',
    };
  }
}
