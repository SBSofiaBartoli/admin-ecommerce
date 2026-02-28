import {
  IsString,
  IsOptional,
  IsNumber,
  MinLength,
  Min,
  IsUUID,
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

  @IsUUID()
  categoryId: string;
}
