import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';
import { CartsIdentity } from './decorators/cart-identity.decorator';
import { isDiscountActive, getDiscountedPrice } from '../common/utils/discount.util';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private variantRepo: Repository<ProductVariant>,
  ) {}

  private async getOrCreateCart(identity: CartsIdentity): Promise<Cart> {
    const where = identity.userId
      ? { user: { id: identity.userId } }
      : { guestId: identity.guestId };

    let cart = await this.cartRepo.findOne({
      where,
      relations: { items: { variant: { product: true } } },
    });

    if (!cart) {
      cart = this.cartRepo.create(
        identity.userId
          ? { user: { id: identity.userId } as any, items: [] }
          : { guestId: identity.guestId, items: [] },
      );
      cart = await this.cartRepo.save(cart);
    }

    return cart;
  }

  async getCart(identity: CartsIdentity) {
    const cart = await this.getOrCreateCart(identity);
    return this.buildCartResponse(cart);
  }

  async addItem(identity: CartsIdentity, dto: AddToCartDto) {
    const variant = await this.variantRepo.findOne({
      where: { id: dto.variantId },
      relations: { product: true },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if (dto.quantity > variant.stock) {
      throw new BadRequestException(
        `Only ${variant.stock} left in stock for this option`,
      );
    }

    const cart = await this.getOrCreateCart(identity);

    let cartItem = await this.cartItemRepo.findOne({
      where: { cart: { id: cart.id }, variant: { id: dto.variantId } },
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + dto.quantity;
      if (newQuantity > variant.stock) {
        throw new BadRequestException(
          `Only ${variant.stock} left in stock — you already have ${cartItem.quantity} in your cart`,
        );
      }
      cartItem.quantity = newQuantity;
    } else {
      cartItem = this.cartItemRepo.create({
        cart,
        variant,
        quantity: dto.quantity,
      });
    }

    await this.cartItemRepo.save(cartItem);

    const updatedCart = await this.getOrCreateCart(identity);
    return {
      message: 'Item added to cart',
      cart: this.buildCartResponse(updatedCart),
    };
  }

  async updateItem(
    identity: CartsIdentity,
    itemId: string,
    dto: UpdateCartItemDto,
  ) {
    const cart = await this.getOrCreateCart(identity);

    const cartItem = await this.cartItemRepo.findOne({
      where: { id: itemId, cart: { id: cart.id } },
      relations: { variant: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (dto.quantity > cartItem.variant.stock) {
      throw new BadRequestException(
        `Only ${cartItem.variant.stock} left in stock for this option`,
      );
    }

    cartItem.quantity = dto.quantity;
    await this.cartItemRepo.save(cartItem);

    const updatedCart = await this.getOrCreateCart(identity);
    return {
      message: 'Cart item updated',
      cart: this.buildCartResponse(updatedCart),
    };
  }

  async removeItem(identity: CartsIdentity, itemId: string) {
    const cart = await this.getOrCreateCart(identity);

    const cartItem = await this.cartItemRepo.findOne({
      where: { id: itemId, cart: { id: cart.id } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepo.remove(cartItem);

    const updatedCart = await this.getOrCreateCart(identity);
    return {
      message: 'Item removed from cart',
      cart: this.buildCartResponse(updatedCart),
    };
  }

  async clearCart(identity: CartsIdentity) {
    const cart = await this.getOrCreateCart(identity);
    await this.cartItemRepo.remove(cart.items);
    return { message: 'Cart cleared' };
  }

  /**
   * Called at login time. Merges a guest cart into the user's cart.
   * If the user has no existing cart, the guest cart is simply claimed.
   * If both exist, overlapping variants have quantities summed (capped at stock);
   * non-overlapping variants are moved over as-is.
   */
  async mergeGuestCartIntoUser(guestId: string, userId: string): Promise<void> {
    const guestCart = await this.cartRepo.findOne({
      where: { guestId },
      relations: { items: { variant: true } },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return; // nothing to merge
    }

    const userCart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: { items: { variant: true } },
    });

    if (!userCart) {
      // No existing user cart — just claim the guest cart directly
      guestCart.user = { id: userId } as any;
      guestCart.guestId = null as any;
      await this.cartRepo.save(guestCart);
      return;
    }

    // Both exist — merge item by item
    for (const guestItem of guestCart.items) {
      const existingItem = userCart.items.find(
        (item) => item.variant.id === guestItem.variant.id,
      );

      if (existingItem) {
        const combinedQuantity = existingItem.quantity + guestItem.quantity;
        existingItem.quantity = Math.min(
          combinedQuantity,
          guestItem.variant.stock,
        );
        await this.cartItemRepo.save(existingItem);
      } else {
        guestItem.cart = userCart;
        await this.cartItemRepo.save(guestItem);
      }
    }

    // Clean up the now-empty guest cart
    await this.cartRepo.remove(guestCart);
  }


private buildCartResponse(cart: Cart) {
  const items = cart.items.map((item) => {
    const product = item.variant.product;
    const discountActive = isDiscountActive(product);
    const effectivePrice = discountActive
      ? getDiscountedPrice(Number(item.variant.price), product)
      : Number(item.variant.price);

    return {
      id: item.id,
      quantity: item.quantity,
      variant: {
        id: item.variant.id,
        length: item.variant.length,
        pattern: item.variant.pattern,
        originalPrice: item.variant.price,
        effectivePrice,
        stock: item.variant.stock,
        product: { id: product.id, name: product.name, slug: product.slug, images: product.images },
      },
      subtotal: effectivePrice * item.quantity,
    };
  });

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return { id: cart.id, items, total };
}
}
