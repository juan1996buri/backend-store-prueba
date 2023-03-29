import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';

export class CreateProductDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

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

  @IsNotEmpty()
  category: CreateCategoryDto;
}
