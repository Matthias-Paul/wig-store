import { IsInt, IsNotEmpty, Min, Max, Matches } from 'class-validator';

export class SetDiscountDto {
  @IsInt()
  @Min(1)
  @Max(90)
  discountPercentage: number;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/, {
    message: 'startDate must be in format YYYY-MM-DDTHH:mm',
  })
  startDate: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/, {
    message: 'endDate must be in format YYYY-MM-DDTHH:mm',
  })
  endDate: string;
}
