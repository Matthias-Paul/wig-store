import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { slugify } from '../common/utils/slugify';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const slug = slugify(dto.name);

    const existing = await this.categoryRepo.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('A category with this name already exists');
    }

    const category = this.categoryRepo.create({
      name: dto.name,
      slug,
      image: dto.image,
    });
    return this.categoryRepo.save(category);
  }

  findAll() {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async findBySlug(slug: string) {
    const category = await this.categoryRepo.findOne({ where: { slug } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findById(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findById(id);

    if (dto.name) {
      const newSlug = slugify(dto.name);
      const existing = await this.categoryRepo.findOne({
        where: { slug: newSlug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('A category with this name already exists');
      }
      category.slug = newSlug;
    }

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.findById(id);

    const productCount = await this.productRepo.count({
      where: { category: { id } },
    });

    if (productCount > 0) {
      throw new ConflictException(
        `Cannot delete "${category.name}" — it still has ${productCount} product(s) assigned to it. Reassign or delete those products first.`,
      );
    }

    await this.categoryRepo.remove(category);

    return {
      success: true,
      message: `Category "${category.name}" deleted successfully.`,
    };
  }
}
