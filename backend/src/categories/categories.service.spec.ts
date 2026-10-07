import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { Product } from 'src/products/entities/product.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockCategory: Category = {
    id: 'cat-1',
    name: 'Lace Front',
    slug: 'lace-front',
    description: 'Desc',
    image: 'img.png',
    products: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const categoryRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const productRepo = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: categoryRepo },
        { provide: getRepositoryToken(Product), useValue: productRepo },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('creates category when slug is unique', async () => {
      categoryRepo.findOne.mockResolvedValue(null);
      categoryRepo.create.mockReturnValue(mockCategory);
      categoryRepo.save.mockResolvedValue(mockCategory);

      const dto = {
        name: 'Lace Front',
        description: 'Desc',
        image: 'img.png',
      };

      await expect(service.create(dto)).resolves.toEqual(mockCategory);
      expect(categoryRepo.findOne).toHaveBeenCalledWith({
        where: { slug: 'lace-front' },
      });
      expect(categoryRepo.save).toHaveBeenCalled();
    });

    it('throws ConflictException when slug exists', async () => {
      categoryRepo.findOne.mockResolvedValue(mockCategory);

      await expect(
        service.create({ name: 'Lace Front', description: 'D' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('returns categories ordered by name', async () => {
      categoryRepo.find.mockResolvedValue([mockCategory]);

      await expect(service.findAll()).resolves.toEqual([mockCategory]);
      expect(categoryRepo.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
    });
  });

  describe('findBySlug', () => {
    it('returns category when found', async () => {
      categoryRepo.findOne.mockResolvedValue(mockCategory);

      await expect(service.findBySlug('lace-front')).resolves.toEqual(
        mockCategory,
      );
    });

    it('throws NotFoundException when missing', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('returns category when found', async () => {
      categoryRepo.findOne.mockResolvedValue(mockCategory);

      await expect(service.findById('cat-1')).resolves.toEqual(mockCategory);
    });

    it('throws NotFoundException when missing', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updates category when name slug is unique', async () => {
      categoryRepo.findOne
        .mockResolvedValueOnce({ ...mockCategory })
        .mockResolvedValueOnce(null);
      const saved = { ...mockCategory, name: 'New Name', slug: 'new-name' };
      categoryRepo.save.mockResolvedValue(saved);

      const result = await service.update('cat-1', { name: 'New Name' });

      expect(result).toEqual(saved);
      expect(categoryRepo.save).toHaveBeenCalled();
    });

    it('throws ConflictException when renamed slug belongs to another category', async () => {
      categoryRepo.findOne
        .mockResolvedValueOnce({ ...mockCategory })
        .mockResolvedValueOnce({ ...mockCategory, id: 'other-id' });

      await expect(
        service.update('cat-1', { name: 'Taken Name' }),
      ).rejects.toThrow(ConflictException);
    });

    it('throws NotFoundException when category id missing', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('missing', { description: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('removes category when no products assigned', async () => {
      categoryRepo.findOne.mockResolvedValue({ ...mockCategory });
      productRepo.count.mockResolvedValue(0);
      categoryRepo.remove.mockResolvedValue(undefined);

      const result = await service.remove('cat-1');

      expect(result).toEqual({
        success: true,
        message: `Category "${mockCategory.name}" deleted successfully.`,
      });
      expect(categoryRepo.remove).toHaveBeenCalled();
    });

    it('throws ConflictException when products exist', async () => {
      categoryRepo.findOne.mockResolvedValue({ ...mockCategory });
      productRepo.count.mockResolvedValue(3);

      await expect(service.remove('cat-1')).rejects.toThrow(ConflictException);
      expect(categoryRepo.remove).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when category missing', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
