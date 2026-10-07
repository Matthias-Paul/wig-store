import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductStatus } from 'src/common/enums/product-status.enum';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsService: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const mockProductsService = {
      findAll: jest.fn(),
      findAllForAdmin: jest.fn(),
      updateStatus: jest.fn(),
      findBySlug: jest.fn(),
      findByIdPublic: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      setDiscount: jest.fn(),
      removeDiscount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    controller = module.get(ProductsController);
    productsService = module.get(ProductsService);
  });

  it('findAll delegates to service with query', async () => {
    const query = { page: 1, limit: 10 };
    const result = { products: [], pagination: {} };
    productsService.findAll.mockResolvedValue(result as never);

    await expect(controller.findAll(query as never)).resolves.toBe(result);
    expect(productsService.findAll).toHaveBeenCalledWith(query);
  });

  it('findAllForAdmin delegates to service', async () => {
    const query = { search: 'wig' };
    const result = { products: [], pagination: {} };
    productsService.findAllForAdmin.mockResolvedValue(result as never);

    await expect(controller.findAllForAdmin(query as never)).resolves.toBe(
      result,
    );
    expect(productsService.findAllForAdmin).toHaveBeenCalledWith(query);
  });

  it('updateStatus passes id and dto', async () => {
    const dto = { status: ProductStatus.PUBLISHED };
    const result = { message: 'ok', product: {} };
    productsService.updateStatus.mockResolvedValue(result as never);

    await expect(
      controller.updateStatus({ id: 'prod-1' } as never, dto as never),
    ).resolves.toBe(result);
    expect(productsService.updateStatus).toHaveBeenCalledWith('prod-1', dto);
  });

  it('findBySlug passes slug', async () => {
    const result = { id: '1', slug: 'my-wig' };
    productsService.findBySlug.mockResolvedValue(result as never);

    await expect(controller.findBySlug('my-wig')).resolves.toBe(result);
    expect(productsService.findBySlug).toHaveBeenCalledWith('my-wig');
  });

  it('findByIdForUser passes id', async () => {
    const result = { id: '1' };
    productsService.findByIdPublic.mockResolvedValue(result as never);

    await expect(controller.findByIdForUser('1')).resolves.toBe(result);
    expect(productsService.findByIdPublic).toHaveBeenCalledWith('1');
  });

  it('findById passes id', async () => {
    const result = { id: '1' };
    productsService.findById.mockResolvedValue(result as never);

    await expect(controller.findById('1')).resolves.toBe(result);
    expect(productsService.findById).toHaveBeenCalledWith('1');
  });

  it('create passes dto', async () => {
    const dto = { name: 'Wig', categoryId: 'cat-1' };
    const result = { id: '1', ...dto };
    productsService.create.mockResolvedValue(result as never);

    await expect(controller.create(dto as never)).resolves.toBe(result);
    expect(productsService.create).toHaveBeenCalledWith(dto);
  });

  it('update passes id and dto', async () => {
    const dto = { name: 'Updated' };
    const result = { id: '1', name: 'Updated' };
    productsService.update.mockResolvedValue(result as never);

    await expect(controller.update('1', dto as never)).resolves.toBe(result);
    expect(productsService.update).toHaveBeenCalledWith('1', dto);
  });

  it('remove passes id', async () => {
    const result = { success: true, message: 'deleted' };
    productsService.remove.mockResolvedValue(result as never);

    await expect(controller.remove('1')).resolves.toBe(result);
    expect(productsService.remove).toHaveBeenCalledWith('1');
  });

  it('setDiscount passes id and dto', async () => {
    const dto = {
      discountPercentage: 10,
      startDate: '2026-01-01T10:00',
      endDate: '2026-01-31T10:00',
    };
    const result = { message: 'Discount set successfully' };
    productsService.setDiscount.mockResolvedValue(result as never);

    await expect(controller.setDiscount('1', dto as never)).resolves.toBe(
      result,
    );
    expect(productsService.setDiscount).toHaveBeenCalledWith('1', dto);
  });

  it('removeDiscount passes id', async () => {
    const result = { message: 'Discount removed successfully' };
    productsService.removeDiscount.mockResolvedValue(result as never);

    await expect(controller.removeDiscount('1')).resolves.toBe(result);
    expect(productsService.removeDiscount).toHaveBeenCalledWith('1');
  });
});
