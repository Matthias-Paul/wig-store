import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import type { CartsIdentity } from './decorators/cart-identity.decorator';

describe('CartsController', () => {
  let controller: CartsController;
  let cartsService: jest.Mocked<CartsService>;

  const identity: CartsIdentity = { guestId: 'guest-123' };

  beforeEach(async () => {
    const mockCartsService = {
      getCart: jest.fn(),
      addItem: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
      clearCart: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [{ provide: CartsService, useValue: mockCartsService }],
    }).compile();

    controller = module.get(CartsController);
    cartsService = module.get(CartsService);
  });

  it('getCart delegates to service', async () => {
    const result = { id: 'cart-1', items: [], total: 0 };
    cartsService.getCart.mockResolvedValue(result);

    await expect(controller.getCart(identity)).resolves.toBe(result);
    expect(cartsService.getCart).toHaveBeenCalledWith(identity);
  });

  it('addItem delegates to service', async () => {
    const dto = { variantId: 'var-1', quantity: 2 };
    const result = { message: 'Item added to cart', cart: {} };
    cartsService.addItem.mockResolvedValue(result as never);

    await expect(controller.addItem(identity, dto as never)).resolves.toBe(
      result,
    );
    expect(cartsService.addItem).toHaveBeenCalledWith(identity, dto);
  });

  it('updateItem delegates to service', async () => {
    const dto = { quantity: 3 };
    const result = { message: 'Cart item updated', cart: {} };
    cartsService.updateItem.mockResolvedValue(result as never);

    await expect(
      controller.updateItem(identity, 'item-1', dto as never),
    ).resolves.toBe(result);
    expect(cartsService.updateItem).toHaveBeenCalledWith(
      identity,
      'item-1',
      dto,
    );
  });

  it('removeItem delegates to service', async () => {
    const result = { message: 'Item removed from cart', cart: {} };
    cartsService.removeItem.mockResolvedValue(result as never);

    await expect(controller.removeItem(identity, 'item-1')).resolves.toBe(
      result,
    );
    expect(cartsService.removeItem).toHaveBeenCalledWith(identity, 'item-1');
  });

  it('clearCart delegates to service', async () => {
    const result = { message: 'Cart cleared' };
    cartsService.clearCart.mockResolvedValue(result);

    await expect(controller.clearCart(identity)).resolves.toBe(result);
    expect(cartsService.clearCart).toHaveBeenCalledWith(identity);
  });
});
