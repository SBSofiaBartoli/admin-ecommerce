import {
  IsString,
  IsOptional,
  MinLength,
  IsUUID,
  IsEnum,
} from 'class-validator';

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
}
