import {
  IsString,
  IsOptional,
  MinLength,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  position?: number;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}
