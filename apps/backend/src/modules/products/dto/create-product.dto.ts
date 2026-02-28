import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  MinLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  categoryId: string;
}
