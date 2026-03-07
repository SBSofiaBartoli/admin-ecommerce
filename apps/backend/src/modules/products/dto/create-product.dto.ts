import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  MinLength,
  IsUUID,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateVariantDto } from './create-product-variant.dto';

enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}
