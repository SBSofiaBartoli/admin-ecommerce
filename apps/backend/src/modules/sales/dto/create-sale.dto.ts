import { IsNumber, Min } from 'class-validator';

export class CreateSaleDto {
  @IsNumber()
  @Min(0)
  total: number;
}
