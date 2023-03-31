import { Type } from 'class-transformer';
import {
  IsDecimal,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
} from 'class-validator';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';

export class CreateProductDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/)
  @IsDecimal({ decimal_digits: '2' })
  price: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  stock: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  //@IsObject()
  category: CreateCategoryDto;
}
