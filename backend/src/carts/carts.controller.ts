import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddToCartDto } from './dtos/add-to-cart.dto';
import { UpdateCartItemDto } from './dtos/update-cart-item.dto';
import { AllowAnonymous } from '../common/decorators/allow-anonymous.decorator';
import {
  GetCartsIdentity,
  type CartsIdentity,
} from './decorators/cart-identity.decorator';

@Controller('cart')
@AllowAnonymous() // every route here works for guests AND logged-in users
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  getCart(@GetCartsIdentity() identity: CartsIdentity) {
    return this.cartsService.getCart(identity);
  }

  @Post('items')
  addItem(
    @GetCartsIdentity() identity: CartsIdentity,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartsService.addItem(identity, dto);
  }

  @Patch('items/:itemId')
  updateItem(
    @GetCartsIdentity() identity: CartsIdentity,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItem(identity, itemId, dto);
  }

  @Delete('items/:itemId')
  removeItem(
    @GetCartsIdentity() identity: CartsIdentity,
    @Param('itemId') itemId: string,
  ) {
    return this.cartsService.removeItem(identity, itemId);
  }

  @Delete()
  clearCart(@GetCartsIdentity() identity: CartsIdentity) {
    return this.cartsService.clearCart(identity);
  }
}
