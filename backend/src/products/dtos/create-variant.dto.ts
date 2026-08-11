import {
  IsInt,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateVariantDto {
  @IsInt()
  @Min(1)
  length: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  color: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  laceType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  closureSize?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}
