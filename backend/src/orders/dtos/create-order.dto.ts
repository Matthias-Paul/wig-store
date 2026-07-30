import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  recipientName: string;

  @IsPhoneNumber('NG')
  recipientPhone: string;

  @IsEmail()
  recipientEmail: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  shippingCity: string;

  @IsString()
  @IsNotEmpty()
  shippingState: string;

  @IsOptional()
  @IsString()
  landmark?: string;
}
