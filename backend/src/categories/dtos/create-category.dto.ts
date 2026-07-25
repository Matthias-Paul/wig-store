import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;
}
