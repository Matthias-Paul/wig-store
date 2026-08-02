import { IsNotEmpty, IsUUID } from 'class-validator';

export class InitializePaymentDto {
  @IsNotEmpty()
  @IsUUID()
  orderId: string;
}
