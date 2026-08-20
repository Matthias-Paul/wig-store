import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  description: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;
}
