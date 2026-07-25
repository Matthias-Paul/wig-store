import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  images: string[];

  @IsUUID()
  categoryId: string;
}
