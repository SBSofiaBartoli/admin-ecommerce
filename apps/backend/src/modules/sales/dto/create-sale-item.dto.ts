import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { CreateSaleItemDto } from './create-sale.dto';

export class CreateSaleDto {
  @IsUUID()
  customerId: string;

  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}
