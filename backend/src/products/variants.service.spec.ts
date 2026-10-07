import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductsService } from './products.service';
import { ProductStatus } from 'src/common/enums/product-status.enum';

describe('VariantsService', () => {
  let service: VariantsService;
  let variantRepo: {
    findOne: jest.Mock;
    find: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
    count: jest.Mock;
  };
  let productsService: { findById: jest.Mock };

  const baseProduct = {
    id: 'prod-1',
    name: 'Bundle Hair',
    slug: 'bundle-hair',
    description: 'd',
    images: [],
    status: ProductStatus.DRAFT,
    category: { id: 'cat-1', name: 'Hair Bundles', slug: 'hair-bundles' },
    variants: [],
  };

  const variant = {
    id: 'var-1',
    length: '12',
    color: 'black',
    laceType: 'HD',
    closureSize: null,
    sku: 'BUNDLE-12-BLK',
    price: 100,
    stock: 10,
    product: baseProduct,
  } as ProductVariant;

  beforeEach(async () => {
    variantRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto) => ({ id: 'new-var', ...dto })),
      save: jest.fn((entity) => Promise.resolve({ ...entity })),
      remove: jest.fn(),
      count: jest.fn(),
    };
    productsService = {
      findById: jest.fn().mockResolvedValue(baseProduct),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariantsService,
        { provide: getRepositoryToken(ProductVariant), useValue: variantRepo },
        { provide: ProductsService, useValue: productsService },
      ],
    }).compile();

    service = module.get(VariantsService);
  });

  describe('create', () => {
    const dto = {
      length: '14',
      color: 'brown',
      laceType: 'HD',
      price: 120,
      stock: 5,
    };

    it('creates variant when valid', async () => {
      variantRepo.findOne.mockResolvedValue(null);
      variantRepo.save.mockResolvedValue({ ...variant, ...dto, id: 'var-new' });
      productsService.findById.mockResolvedValue({
        ...baseProduct,
        variants: [variant],
      });

      const result = await service.create('prod-1', dto as never);

      expect(result.message).toBe('Variant created successfully');
      expect(variantRepo.save).toHaveBeenCalled();
    });

    it('requires lace type for luxury category', async () => {
      productsService.findById.mockResolvedValue({
        ...baseProduct,
        category: {
          id: 'cat-2',
          name: 'Luxury Hairs',
          slug: 'luxury-hairs',
        },
      });

      await expect(
        service.create('prod-1', {
          length: '12',
          color: 'black',
          price: 100,
          stock: 1,
        } as never),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws on duplicate variant combination', async () => {
      variantRepo.findOne.mockResolvedValue({ id: 'existing' });

      await expect(service.create('prod-1', dto as never)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAllForProduct', () => {
    it('returns variants ordered list', async () => {
      variantRepo.find.mockResolvedValue([variant]);

      const result = await service.findAllForProduct('prod-1');

      expect(result.variants).toEqual([variant]);
      expect(variantRepo.find).toHaveBeenCalledWith({
        where: { product: { id: 'prod-1' } },
        order: { length: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('returns variant', async () => {
      variantRepo.findOne.mockResolvedValue(variant);

      await expect(service.findOne('prod-1', 'var-1')).resolves.toEqual(
        variant,
      );
    });

    it('throws when not found', async () => {
      variantRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('prod-1', 'missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('throws when lace type cleared for required category', async () => {
      variantRepo.findOne.mockResolvedValue({ ...variant, laceType: 'HD' });
      productsService.findById.mockResolvedValue({
        ...baseProduct,
        category: {
          id: 'cat-2',
          name: 'Luxury Hairs',
          slug: 'luxury-hairs',
        },
      });

      await expect(
        service.update('prod-1', 'var-1', { laceType: null } as never),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws on duplicate combination after update', async () => {
      variantRepo.findOne
        .mockResolvedValueOnce({ ...variant })
        .mockResolvedValueOnce({ id: 'other', length: '16', color: 'red' });

      await expect(
        service.update('prod-1', 'var-1', {
          length: '16',
          color: 'red',
        } as never),
      ).rejects.toThrow(ConflictException);
    });

    it('updates variant successfully', async () => {
      variantRepo.findOne.mockResolvedValue({ ...variant });
      variantRepo.save.mockResolvedValue({ ...variant, price: 150 });
      productsService.findById.mockResolvedValue({
        ...baseProduct,
        variants: [variant],
      });

      const result = await service.update('prod-1', 'var-1', {
        price: 150,
      } as never);

      expect(result.message).toBe('Variant updated successfully');
      expect(result.variant.price).toBe(150);
    });
  });

  describe('remove', () => {
    it('throws when deleting last variant of published product', async () => {
      variantRepo.findOne.mockResolvedValue(variant);
      variantRepo.count.mockResolvedValue(1);
      productsService.findById.mockResolvedValue({
        ...baseProduct,
        status: ProductStatus.PUBLISHED,
      });

      await expect(service.remove('prod-1', 'var-1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('removes variant when allowed', async () => {
      variantRepo.findOne.mockResolvedValue(variant);
      variantRepo.count.mockResolvedValue(2);

      const result = await service.remove('prod-1', 'var-1');

      expect(variantRepo.remove).toHaveBeenCalledWith(variant);
      expect(result.message).toBe('Variant deleted successfully');
    });
  });
});
