import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductsQueryDto } from './dtos/get-products-query.dto';
import { slugify } from '../common/utils/slugify';

interface VariantCountRow {
  productId: string;
  count: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

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
      .leftJoinAndSelect('product.category', 'category');

    if (search) {
      qb.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    if (categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      qb.andWhere(
        `EXISTS (
        SELECT 1 FROM product_variants pv
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

    // Fetch variant counts for just this page of products, in one query
    const productIds = products.map((p) => p.id);
    let variantCounts: Record<string, number> = {};

    if (productIds.length > 0) {
      const counts = await this.productRepo.manager
        .createQueryBuilder()
        .select('variant.productId', 'productId')
        .addSelect('COUNT(*)', 'count')
        .from('product_variants', 'variant')
        .where('variant.productId IN (:...productIds)', { productIds })
        .groupBy('variant.productId')
        .getRawMany<VariantCountRow>();

      variantCounts = counts.reduce((acc: Record<string, number>, row) => {
        acc[row.productId] = parseInt(row.count, 10);
        return acc;
      }, {});
    }

    const productsWithCount = products.map((product) => ({
      ...product,
      variantCount: variantCounts[product.id] ?? 0,
    }));

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
    const product = await this.productRepo.findOne({
      where: { slug },
      relations: { category: true, variants: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
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

  async create(dto: CreateProductDto) {
    const slug = slugify(dto.name);

    const existing = await this.productRepo.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('A product with this name already exists');
    }

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

    if (dto.name) {
      const newSlug = slugify(dto.name);
      const existing = await this.productRepo.findOne({
        where: { slug: newSlug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('A product with this name already exists');
      }
      product.slug = newSlug;
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
  async remove(id: string) {
    const product = await this.findById(id);
    await this.productRepo.remove(product);
  }
}
