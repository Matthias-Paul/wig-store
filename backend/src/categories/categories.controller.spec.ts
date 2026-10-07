import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const categoriesService = {
    findAll: jest.fn(),
    findBySlug: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: categoriesService },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  describe('findAll', () => {
    it('delegates to categoriesService.findAll', async () => {
      const categories = [{ id: '1', name: 'A' }];
      categoriesService.findAll.mockResolvedValue(categories);

      await expect(controller.findAll()).resolves.toEqual(categories);
      expect(categoriesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('delegates to categoriesService.findBySlug with slug param', async () => {
      const category = { id: '1', slug: 'lace-front' };
      categoriesService.findBySlug.mockResolvedValue(category);

      await expect(controller.findBySlug('lace-front')).resolves.toEqual(
        category,
      );
      expect(categoriesService.findBySlug).toHaveBeenCalledWith('lace-front');
    });
  });

  describe('create', () => {
    it('delegates to categoriesService.create with dto', async () => {
      const dto = { name: 'New', description: 'D', image: 'i.png' };
      const created = { id: '1', ...dto };
      categoriesService.create.mockResolvedValue(created);

      await expect(controller.create(dto)).resolves.toEqual(created);
      expect(categoriesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('delegates to categoriesService.update with id and dto', async () => {
      const dto = { name: 'Updated' };
      const updated = { id: 'cat-1', name: 'Updated' };
      categoriesService.update.mockResolvedValue(updated);

      await expect(controller.update('cat-1', dto)).resolves.toEqual(updated);
      expect(categoriesService.update).toHaveBeenCalledWith('cat-1', dto);
    });
  });

  describe('remove', () => {
    it('delegates to categoriesService.remove with id', async () => {
      const result = { success: true, message: 'deleted' };
      categoriesService.remove.mockResolvedValue(result);

      await expect(controller.remove('cat-1')).resolves.toEqual(result);
      expect(categoriesService.remove).toHaveBeenCalledWith('cat-1');
    });
  });
});
