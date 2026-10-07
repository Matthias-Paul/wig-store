import { Test, TestingModule } from '@nestjs/testing';
import { VariantsController } from './variants.controller';
import { VariantsService } from './variants.service';

describe('VariantsController', () => {
  let controller: VariantsController;
  let variantsService: jest.Mocked<VariantsService>;

  beforeEach(async () => {
    const mockVariantsService = {
      findAllForProduct: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariantsController],
      providers: [
        { provide: VariantsService, useValue: mockVariantsService },
      ],
    }).compile();

    controller = module.get(VariantsController);
    variantsService = module.get(VariantsService);
  });

  it('findAll delegates to service', async () => {
    const result = { message: 'ok', variants: [] };
    variantsService.findAllForProduct.mockResolvedValue(result);

    await expect(controller.findAll('prod-1')).resolves.toBe(result);
    expect(variantsService.findAllForProduct).toHaveBeenCalledWith('prod-1');
  });

  it('findOne delegates to service', async () => {
    const result = { id: 'var-1' };
    variantsService.findOne.mockResolvedValue(result as never);

    await expect(controller.findOne('prod-1', 'var-1')).resolves.toBe(result);
    expect(variantsService.findOne).toHaveBeenCalledWith('prod-1', 'var-1');
  });

  it('create delegates to service', async () => {
    const dto = { length: '12', color: 'black', price: 100, stock: 5 };
    const result = { message: 'Variant created successfully' };
    variantsService.create.mockResolvedValue(result as never);

    await expect(controller.create('prod-1', dto as never)).resolves.toBe(
      result,
    );
    expect(variantsService.create).toHaveBeenCalledWith('prod-1', dto);
  });

  it('update delegates to service', async () => {
    const dto = { price: 120 };
    const result = { message: 'Variant updated successfully' };
    variantsService.update.mockResolvedValue(result as never);

    await expect(
      controller.update('prod-1', 'var-1', dto as never),
    ).resolves.toBe(result);
    expect(variantsService.update).toHaveBeenCalledWith(
      'prod-1',
      'var-1',
      dto,
    );
  });

  it('remove delegates to service', async () => {
    const result = { message: 'Variant deleted successfully' };
    variantsService.remove.mockResolvedValue(result);

    await expect(controller.remove('prod-1', 'var-1')).resolves.toBe(result);
    expect(variantsService.remove).toHaveBeenCalledWith('prod-1', 'var-1');
  });
});
