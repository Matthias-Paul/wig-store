import {
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';
import { HairPattern } from 'src/common/enums/hair-pattern.enum';

export class CreateVariantDto {
  @IsInt()
  @Min(1)
  length: number;

  @IsEnum(HairPattern)
  pattern: HairPattern;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}
