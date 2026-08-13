import { IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';

export class UpdateDeliveryFeeDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fee: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
