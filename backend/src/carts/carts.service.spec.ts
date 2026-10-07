import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';

describe('CartsService', () => {
  let service: CartsService;
  let cartRepo: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
  };
  let cartItemRepo: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
  };
  let variantRepo: { findOne: jest.Mock };

  const product = {
    id: 'prod-1',
    name: 'Wig',
    slug: 'wig',
    images: ['img.jpg'],
    discountPercentage: null,
    discountStartDate: null,
    discountEndDate: null,
  };

  const variant = {
    id: 'var-1',
    length: '12',
    color: 'black',
    laceType: null,
    closureSize: null,
    sku: 'SKU-1',
    price: 100,
    stock: 5,
    product,
  };

  const cartWithItem: Cart = {
    id: 'cart-1',
    guestId: 'guest-1',
    items: [
      {
        id: 'item-1',
        quantity: 2,
        variant,
      },
    ],
  } as Cart;

  beforeEach(async () => {
    cartRepo = {
      findOne: jest.fn(),
      create: jest.fn((dto) => ({ id: 'new-cart', ...dto })),
      save: jest.fn((entity) => Promise.resolve({ ...entity })),
      remove: jest.fn(),
    };
    cartItemRepo = {
      findOne: jest.fn(),
      create: jest.fn((dto) => ({ id: 'new-item', ...dto })),
      save: jest.fn((entity) => Promise.resolve({ ...entity })),
      remove: jest.fn(),
    };
    variantRepo = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        { provide: getRepositoryToken(Cart), useValue: cartRepo },
        { provide: getRepositoryToken(CartItem), useValue: cartItemRepo },
        {
          provide: getRepositoryToken(ProductVariant),
          useValue: variantRepo,
        },
      ],
    }).compile();

    service = module.get(CartsService);
  });

  describe('getCart', () => {
    it('returns existing cart with totals', async () => {
      cartRepo.findOne.mockResolvedValue(cartWithItem);

      const result = await service.getCart({ guestId: 'guest-1' });

      expect(result.id).toBe('cart-1');
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(200);
    });

    it('creates cart when missing', async () => {
      cartRepo.findOne.mockResolvedValue(null);
      cartRepo.save.mockResolvedValue({
        id: 'cart-new',
        guestId: 'guest-2',
        items: [],
      });

      const result = await service.getCart({ guestId: 'guest-2' });

      expect(cartRepo.create).toHaveBeenCalled();
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('addItem', () => {
    const dto = { variantId: 'var-1', quantity: 1 };

    it('throws when variant not found', async () => {
      variantRepo.findOne.mockResolvedValue(null);

      await expect(
        service.addItem({ guestId: 'g1' }, dto),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws when quantity exceeds stock', async () => {
      variantRepo.findOne.mockResolvedValue({ ...variant, stock: 2 });

      await expect(
        service.addItem({ guestId: 'g1' }, { variantId: 'var-1', quantity: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('adds new line item', async () => {
      variantRepo.findOne.mockResolvedValue(variant);
      cartRepo.findOne
        .mockResolvedValueOnce({ id: 'cart-1', items: [] })
        .mockResolvedValueOnce(cartWithItem);
      cartItemRepo.findOne.mockResolvedValue(null);

      const result = await service.addItem({ guestId: 'guest-1' }, dto);

      expect(result.message).toBe('Item added to cart');
      expect(cartItemRepo.save).toHaveBeenCalled();
    });

    it('throws when combined quantity exceeds stock', async () => {
      variantRepo.findOne.mockResolvedValue(variant);
      cartRepo.findOne.mockResolvedValue({ id: 'cart-1', items: [] });
      cartItemRepo.findOne.mockResolvedValue({
        id: 'item-1',
        quantity: 4,
        variant,
      });

      await expect(
        service.addItem({ guestId: 'g1' }, { variantId: 'var-1', quantity: 2 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateItem', () => {
    it('throws when cart item missing', async () => {
      cartRepo.findOne.mockResolvedValue({ id: 'cart-1', items: [] });
      cartItemRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateItem({ guestId: 'g1' }, 'item-1', { quantity: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws when quantity exceeds stock', async () => {
      cartRepo.findOne.mockResolvedValue(cartWithItem);
      cartItemRepo.findOne.mockResolvedValue({
        id: 'item-1',
        quantity: 1,
        variant: { ...variant, stock: 2 },
      });

      await expect(
        service.updateItem({ guestId: 'g1' }, 'item-1', { quantity: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('updates quantity', async () => {
      cartRepo.findOne
        .mockResolvedValueOnce(cartWithItem)
        .mockResolvedValueOnce(cartWithItem);
      cartItemRepo.findOne.mockResolvedValue({
        id: 'item-1',
        quantity: 1,
        variant,
      });

      const result = await service.updateItem(
        { guestId: 'guest-1' },
        'item-1',
        { quantity: 3 },
      );

      expect(result.message).toBe('Cart item updated');
      expect(cartItemRepo.save).toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('throws when item not found', async () => {
      cartRepo.findOne.mockResolvedValue({ id: 'cart-1', items: [] });
      cartItemRepo.findOne.mockResolvedValue(null);

      await expect(
        service.removeItem({ guestId: 'g1' }, 'item-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('removes item', async () => {
      cartRepo.findOne
        .mockResolvedValueOnce(cartWithItem)
        .mockResolvedValueOnce({ id: 'cart-1', items: [] });
      cartItemRepo.findOne.mockResolvedValue({ id: 'item-1' });

      const result = await service.removeItem({ guestId: 'guest-1' }, 'item-1');

      expect(cartItemRepo.remove).toHaveBeenCalled();
      expect(result.message).toBe('Item removed from cart');
    });
  });

  describe('clearCart', () => {
    it('removes all items', async () => {
      cartRepo.findOne.mockResolvedValue(cartWithItem);

      const result = await service.clearCart({ guestId: 'guest-1' });

      expect(cartItemRepo.remove).toHaveBeenCalledWith(cartWithItem.items);
      expect(result.message).toBe('Cart cleared');
    });
  });

  describe('mergeGuestCartIntoUser', () => {
    it('returns early when guest cart is empty', async () => {
      cartRepo.findOne.mockResolvedValue(null);

      await service.mergeGuestCartIntoUser('guest-1', 'user-1');

      expect(cartRepo.save).not.toHaveBeenCalled();
    });

    it('claims guest cart when user has no cart', async () => {
      const guestCart = {
        id: 'guest-cart',
        guestId: 'guest-1',
        items: [{ id: 'i1', variant, quantity: 1 }],
      };
      cartRepo.findOne
        .mockResolvedValueOnce(guestCart)
        .mockResolvedValueOnce(null);

      await service.mergeGuestCartIntoUser('guest-1', 'user-1');

      expect(cartRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ user: { id: 'user-1' }, guestId: null }),
      );
    });

    it('merges overlapping items and removes guest cart', async () => {
      const guestItem = {
        id: 'gi1',
        quantity: 2,
        variant: { ...variant, stock: 5 },
      };
      const userItem = {
        id: 'ui1',
        quantity: 1,
        variant,
      };
      const guestCart = {
        id: 'guest-cart',
        guestId: 'guest-1',
        items: [guestItem],
      };
      const userCart = {
        id: 'user-cart',
        items: [userItem],
      };
      cartRepo.findOne
        .mockResolvedValueOnce(guestCart)
        .mockResolvedValueOnce(userCart);

      await service.mergeGuestCartIntoUser('guest-1', 'user-1');

      expect(cartItemRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 3 }),
      );
      expect(cartRepo.remove).toHaveBeenCalledWith(guestCart);
    });
  });
});
