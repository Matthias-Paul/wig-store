import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductsQueryDto } from './dtos/get-products-query.dto';
import { slugify } from '../common/utils/slugify';
import { ProductStatus } from 'src/common/enums/product-status.enum';
import { UpdateProductStatusDto } from './dtos/update-product-status.dto';
import { SetDiscountDto } from './dtos/set-discount.dto';
import {
  isDiscountActive,
  getDiscountedPrice,
} from '../common/utils/discount.util';
import { CategoriesService } from 'src/categories/categories.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface VariantCountRow {
  productId: string;
  count: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private readonly categoryService: CategoriesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async getVariantCounts(
    productIds: string[],
  ): Promise<Record<string, number>> {
    if (productIds.length === 0) {
      return {};
    }

    const counts = await this.productRepo.manager
      .createQueryBuilder()
      .select('variant.product_id', 'productId')
      .addSelect('COUNT(*)', 'count')
      .from('product_variants', 'variant')
      .where('variant.product_id IN (:...productIds)', { productIds })
      .groupBy('variant.product_id')
      .getRawMany<VariantCountRow>();

    return counts.reduce((acc: Record<string, number>, row) => {
      acc[row.productId] = parseInt(row.count, 10);
      return acc;
    }, {});
  }

  private async getMinPrices(
    productIds: string[],
  ): Promise<Record<string, number>> {
    if (productIds.length === 0) {
      return {};
    }

    interface MinPriceRow {
      productId: string;
      minPrice: string;
    }

    const rows = await this.productRepo.manager
      .createQueryBuilder()
      .select('variant.product_id', 'productId')
      .addSelect('MIN(variant.price)', 'minPrice')
      .from('product_variants', 'variant')
      .where('variant.product_id IN (:...productIds)', { productIds })
      .groupBy('variant.product_id')
      .getRawMany<MinPriceRow>();

    return rows.reduce((acc: Record<string, number>, row) => {
      acc[row.productId] = Number(row.minPrice);
      return acc;
    }, {});
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  private async ensureUniqueSlug(
    base: string,
    excludeId?: string,
  ): Promise<string> {
    const root = slugify(base);
    let candidate = root;
    let i = 2;

    while (true) {
      const existing = await this.productRepo.findOne({
        where: { slug: candidate },
      });
      if (!existing || existing.id === excludeId) {
        return candidate;
      }
      candidate = `${root}-${i}`;
      i += 1;
    }
  }

  private mapProductDetail(product: Product) {
    const discountActive = isDiscountActive(product);

    return {
      ...product,
      isOnDiscount: discountActive,
      variants: (product.variants ?? []).map((variant) => ({
        ...variant,
        originalPrice: variant.price,
        discountedPrice: discountActive
          ? getDiscountedPrice(Number(variant.price), product)
          : Number(variant.price),
      })),
    };
  }

  async findAll(query: GetProductsQueryDto) {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.status = :status', {
        status: ProductStatus.PUBLISHED,
      });

    if (search) {
      qb.andWhere('product.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', {
        categoryId,
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      qb.andWhere(
        `EXISTS (
        SELECT 1
        FROM product_variants pv
        WHERE pv.product_id = product.id
        ${minPrice !== undefined ? 'AND pv.price >= :minPrice' : ''}
        ${maxPrice !== undefined ? 'AND pv.price <= :maxPrice' : ''}
      )`,
        { minPrice, maxPrice },
      );
    }

    const [products, total] = await qb
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const productIds = products.map((p) => p.id);

    const variantCounts = await this.getVariantCounts(productIds);
    const minPrices = await this.getMinPrices(productIds);

    const productsWithDetails = products.map((product) => {
      const startingPrice = minPrices[product.id] ?? 0;
      const discountActive = isDiscountActive(product);

      return {
        ...product,
        variantCount: variantCounts[product.id] ?? 0,
        startingPrice,
        isOnDiscount: discountActive,
        discountedStartingPrice: discountActive
          ? getDiscountedPrice(startingPrice, product)
          : startingPrice,
      };
    });
    return {
      products: productsWithDetails,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }

  async findAllForAdmin(query: GetProductsQueryDto) {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (search) {
      qb.andWhere('product.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', {
        categoryId,
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      qb.andWhere(
        `EXISTS (
        SELECT 1
        FROM product_variants pv
        WHERE pv.product_id = product.id
        ${minPrice !== undefined ? 'AND pv.price >= :minPrice' : ''}
        ${maxPrice !== undefined ? 'AND pv.price <= :maxPrice' : ''}
      )`,
        { minPrice, maxPrice },
      );
    }

    const [products, total] = await qb
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const productIds = products.map((p) => p.id);

    const variantCounts = await this.getVariantCounts(productIds);

    const productsWithCount = products.map((product) => {
      const discountActive = isDiscountActive(product);

      return {
        ...product,

        variantCount: variantCounts[product.id] ?? 0,

        isOnDiscount: discountActive,

        discountPercentage: discountActive ? product.discountPercentage : null,
      };
    });

    return {
      products: productsWithCount,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    };
  }
  async findBySlug(slug: string) {
    let decoded = slug?.trim() ?? '';
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      // keep raw slug if it was not URI-encoded
    }

    if (!decoded) {
      throw new NotFoundException('Product not found');
    }

    // Support /products/:uuid links (and mis-routed id URLs)
    if (this.isUuid(decoded)) {
      return this.findByIdPublic(decoded);
    }

    let product = await this.productRepo.findOne({
      where: { slug: decoded, status: ProductStatus.PUBLISHED },
      relations: { category: true, variants: true },
    });

    // Case-insensitive fallback for older/manual slug rows
    if (!product) {
      product = await this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.variants', 'variants')
        .where('LOWER(product.slug) = LOWER(:slug)', { slug: decoded })
        .andWhere('product.status = :status', {
          status: ProductStatus.PUBLISHED,
        })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapProductDetail(product);
  }

  async findByIdPublic(id: string) {
    const product = await this.productRepo.findOne({
      where: { id, status: ProductStatus.PUBLISHED },
      relations: { category: true, variants: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapProductDetail(product);
  }

  async findById(id: string) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { category: true, variants: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateStatus(id: string, dto: UpdateProductStatusDto) {
    const product = await this.findById(id);

    if (dto.status === ProductStatus.PUBLISHED) {
      if (!product.variants || product.variants.length === 0) {
        throw new ConflictException(
          'Cannot publish a product with no variants — add at least one variant option first.',
        );
      }
    }

    product.status = dto.status;
    const updatedProduct = await this.productRepo.save(product);

    if (dto.status === ProductStatus.PUBLISHED) {
      this.eventEmitter.emit('product.created', updatedProduct);
    }

    return {
      message: `Product status updated to ${dto.status} successfully`,
      product: updatedProduct,
    };
  }

  async create(dto: CreateProductDto) {
    const slug = await this.ensureUniqueSlug(dto.name);

    await this.categoryService.findById(dto.categoryId);

    const product = this.productRepo.create({
      name: dto.name,
      slug,
      description: dto.description,
      images: dto.images,
      category: { id: dto.categoryId } as Category,
    });

    return this.productRepo.save(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findById(id);

    if (dto.categoryId) {
      await this.categoryService.findById(dto.categoryId);
    }

    if (dto.name) {
      product.slug = await this.ensureUniqueSlug(dto.name, id);
      product.name = dto.name;
    }

    if (dto.description) {
      product.description = dto.description;
    }

    if (dto.images) {
      product.images = dto.images;
    }

    if (dto.categoryId) {
      product.category = { id: dto.categoryId } as Category;
    }

    return this.productRepo.save(product);
  }

  async forceUnpublish(id: string) {
    const product = await this.findById(id);
    product.status = ProductStatus.DRAFT;
    return this.productRepo.save(product);
  }

  async remove(id: string) {
    const product = await this.findById(id);
    await this.productRepo.remove(product);
    return {
      success: true,
      message: `Product "${product.name}" deleted successfully.`,
    };
  }

  async setDiscount(id: string, dto: SetDiscountDto) {
    const product = await this.findById(id);

    const startDate = new Date(`${dto.startDate}:00+01:00`);
    const endDate = new Date(`${dto.endDate}:00+01:00`);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    product.discountPercentage = dto.discountPercentage;
    product.discountStartDate = startDate;
    product.discountEndDate = endDate;

    const updatedProduct = await this.productRepo.save(product);

    return {
      message: 'Discount set successfully',
      product: updatedProduct,
    };
  }

  async removeDiscount(id: string) {
    const product = await this.findById(id);

    product.discountPercentage = null;
    product.discountStartDate = null;
    product.discountEndDate = null;

    await this.productRepo.save(product);

    return { message: 'Discount removed successfully' };
  }
}
