import { Type } from 'class-transformer';
import { IsInt, IsUUID, Min, ValidateNested } from 'class-validator';

export class CreateSaleDto {
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}

export class CreateSaleItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
