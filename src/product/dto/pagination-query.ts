import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsOptional()
  @IsString()
  route: string;

  @IsOptional()
  @IsString()
  category: string;
}
