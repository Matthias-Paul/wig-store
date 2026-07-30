import { IsInt, IsNotEmpty, Min, Max, IsDateString } from 'class-validator';

export class SetDiscountDto {
  @IsInt()
  @Min(1)
  @Max(90)
  discountPercentage: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}