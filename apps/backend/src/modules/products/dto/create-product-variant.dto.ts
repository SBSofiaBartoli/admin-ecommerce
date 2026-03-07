import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateVariantOptionValueDto {
  @IsString()
  optionName: string;

  @IsString()
  value: string;
}

export class CreateVariantDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantOptionValueDto)
  combination: CreateVariantOptionValueDto[];

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNumber()
  @Min(0)
  stock: number;
}
