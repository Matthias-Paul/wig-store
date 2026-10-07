import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductStatus } from 'src/common/enums/product-status.enum';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepo: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
    createQueryBuilder: jest.Mock;
    manager: { createQueryBuilder: jest.Mock };
  };
  let categoryService: { findById: jest.Mock };
  let eventEmitter: { emit: jest.Mock };

  const product = {
    id: 'prod-1',
    name: 'Silk Wig',
    slug: 'silk-wig',
    description: 'Nice',
    images: [],
    status: ProductStatus.DRAFT,
    category: { id: 'cat-1', name: 'Wigs', slug: 'wigs' },
    variants: [{ id: 'v1', price: 100 }],
    discountPercentage: null,
    discountStartDate: null,
    discountEndDate: null,
  } as Product;

  function mockListQueryBuilder(
    products: Product[],
    total: number,
  ): Record<string, jest.Mock> {
    return {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([products, total]),
    };
  }

  function mockManagerQueryBuilder(
    variantCounts: { productId: string; count: string }[],
    minPrices: { productId: string; minPrice: string }[],
  ) {
    let callIndex = 0;
    return jest.fn(() => {
      callIndex++;
      const isCountQuery = callIndex % 2 === 1;
      return {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockResolvedValue(isCountQuery ? variantCounts : minPrices),
      };
    });
  }

  beforeEach(async () => {
    productRepo = {
      findOne: jest.fn(),
      create: jest.fn((dto) => ({ ...dto })),
      save: jest.fn((entity) => Promise.resolve({ ...entity })),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: { createQueryBuilder: jest.fn() },
    };
    categoryService = { findById: jest.fn().mockResolvedValue({ id: 'cat-1' }) };
    eventEmitter = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: productRepo },
        { provide: CategoriesService, useValue: categoryService },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get(ProductsService);
  });

  describe('findAll', () => {
    it('returns paginated products with variant counts and prices', async () => {
      productRepo.createQueryBuilder.mockReturnValue(
        mockListQueryBuilder([product], 1),
      );
      productRepo.manager.createQueryBuilder = mockManagerQueryBuilder(
        [{ productId: 'prod-1', count: '2' }],
        [{ productId: 'prod-1', minPrice: '100' }],
      );

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.products).toHaveLength(1);
      expect(result.products[0].variantCount).toBe(2);
      expect(result.products[0].startingPrice).toBe(100);
      expect(result.pagination.total).toBe(1);
    });

    it('returns empty maps when no products', async () => {
      productRepo.createQueryBuilder.mockReturnValue(
        mockListQueryBuilder([], 0),
      );

      const result = await service.findAll({});

      expect(result.products).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('findAllForAdmin', () => {
    it('returns admin product list with variant counts', async () => {
      productRepo.createQueryBuilder.mockReturnValue(
        mockListQueryBuilder([product], 1),
      );
      productRepo.manager.createQueryBuilder = mockManagerQueryBuilder(
        [{ productId: 'prod-1', count: '1' }],
        [],
      );

      const result = await service.findAllForAdmin({ page: 1, limit: 10 });

      expect(result.products[0].variantCount).toBe(1);
      expect(result.pagination.hasNextPage).toBe(false);
    });
  });

  describe('findBySlug', () => {
    it('returns product with variant pricing', async () => {
      productRepo.findOne.mockResolvedValue({
        ...product,
        status: ProductStatus.PUBLISHED,
        variants: [{ id: 'v1', price: 50 }],
      });

      const result = await service.findBySlug('silk-wig');

      expect(result.isOnDiscount).toBe(false);
      expect(result.variants[0].originalPrice).toBe(50);
      expect(result.variants[0].discountedPrice).toBe(50);
    });

    it('throws when not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByIdPublic', () => {
    it('throws when not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(service.findByIdPublic('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('returns product', async () => {
      productRepo.findOne.mockResolvedValue(product);

      await expect(service.findById('prod-1')).resolves.toEqual(product);
    });

    it('throws when not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('throws when publishing without variants', async () => {
      productRepo.findOne.mockResolvedValue({ ...product, variants: [] });

      await expect(
        service.updateStatus('prod-1', {
          status: ProductStatus.PUBLISHED,
        } as never),
      ).rejects.toThrow(ConflictException);
    });

    it('emits event when published', async () => {
      const withVariants = {
        ...product,
        variants: [{ id: 'v1' }],
        status: ProductStatus.DRAFT,
      };
      productRepo.findOne.mockResolvedValue(withVariants);
      productRepo.save.mockResolvedValue({
        ...withVariants,
        status: ProductStatus.PUBLISHED,
      });

      const result = await service.updateStatus('prod-1', {
        status: ProductStatus.PUBLISHED,
      } as never);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'product.created',
        expect.objectContaining({ status: ProductStatus.PUBLISHED }),
      );
      expect(result.message).toContain('published');
    });
  });

  describe('create', () => {
    it('creates product when slug is unique', async () => {
      productRepo.findOne.mockResolvedValue(null);

      const dto = {
        name: 'New Wig',
        description: 'Desc',
        images: [],
        categoryId: 'cat-1',
      };
      const saved = { id: 'new-1', slug: 'new-wig', ...dto };
      productRepo.save.mockResolvedValue(saved);

      await expect(service.create(dto as never)).resolves.toEqual(saved);
      expect(categoryService.findById).toHaveBeenCalledWith('cat-1');
    });

    it('throws on duplicate slug', async () => {
      productRepo.findOne.mockResolvedValue({ id: 'other' });

      await expect(
        service.create({
          name: 'Silk Wig',
          description: 'd',
          images: [],
          categoryId: 'cat-1',
        } as never),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('throws when renamed slug conflicts', async () => {
      productRepo.findOne
        .mockResolvedValueOnce(product)
        .mockResolvedValueOnce({ id: 'other', slug: 'taken-name' });

      await expect(
        service.update('prod-1', { name: 'Taken Name' } as never),
      ).rejects.toThrow(ConflictException);
    });

    it('updates and saves product', async () => {
      productRepo.findOne.mockResolvedValue({ ...product });

      const updated = await service.update('prod-1', {
        description: 'Updated desc',
      } as never);

      expect(updated.description).toBe('Updated desc');
      expect(productRepo.save).toHaveBeenCalled();
    });
  });

  describe('forceUnpublish', () => {
    it('sets status to draft', async () => {
      productRepo.findOne.mockResolvedValue({
        ...product,
        status: ProductStatus.PUBLISHED,
      });

      const result = await service.forceUnpublish('prod-1');

      expect(result.status).toBe(ProductStatus.DRAFT);
    });
  });

  describe('remove', () => {
    it('removes product and returns message', async () => {
      productRepo.findOne.mockResolvedValue(product);

      const result = await service.remove('prod-1');

      expect(productRepo.remove).toHaveBeenCalledWith(product);
      expect(result.success).toBe(true);
    });
  });

  describe('setDiscount', () => {
    it('throws when end date is not after start', async () => {
      productRepo.findOne.mockResolvedValue(product);

      await expect(
        service.setDiscount('prod-1', {
          discountPercentage: 10,
          startDate: '2026-02-01T10:00',
          endDate: '2026-01-01T10:00',
        } as never),
      ).rejects.toThrow(BadRequestException);
    });

    it('saves discount fields', async () => {
      productRepo.findOne.mockResolvedValue({ ...product });

      const result = await service.setDiscount('prod-1', {
        discountPercentage: 15,
        startDate: '2026-01-01T10:00',
        endDate: '2026-02-01T10:00',
      } as never);

      expect(result.message).toBe('Discount set successfully');
      expect(productRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ discountPercentage: 15 }),
      );
    });
  });

  describe('removeDiscount', () => {
    it('clears discount fields', async () => {
      productRepo.findOne.mockResolvedValue({
        ...product,
        discountPercentage: 10,
      });

      const result = await service.removeDiscount('prod-1');

      expect(result.message).toBe('Discount removed successfully');
      expect(productRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          discountPercentage: null,
          discountStartDate: null,
          discountEndDate: null,
        }),
      );
    });
  });
});
