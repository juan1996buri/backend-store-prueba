import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateProductDto } from 'src/product/dto/create-product.dto';

export class CreateCategoryDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  product: CreateProductDto[];
}
