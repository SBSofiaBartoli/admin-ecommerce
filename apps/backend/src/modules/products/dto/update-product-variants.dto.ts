import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateVariantDto } from './create-product-variant.dto';

export class UpdateProductVariantsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}
