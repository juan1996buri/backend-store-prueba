import {
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, PaginationQueryDto, UpdateProductDto } from './dto';
import { RolesGuard } from 'src/roles/guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/roles/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { TypesRoles } from 'src/common/emun/tyes-roles';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Roles('ADMIN')
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() pagination: PaginationQueryDto) {
    pagination.limit = pagination.limit > 100 ? 100 : pagination.limit;
    pagination.route = `http://localhost:4000/product?category=${pagination.category}`;
    return await this.productService.findAll(pagination);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productService.findOne(id);
  }

  @Roles(TypesRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  async update(@Body() updateProductDto: UpdateProductDto) {
    return await this.productService.update(updateProductDto);
  }

  @Roles(TypesRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.productService.remove(id);
  }

  //@Roles(TypesRoles.ADMIN)
  //@UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.create(dto, file);
  }

  //@Post()
  create_(@Body() dto: CreateProductDto) {
    console.log(dto);
  }
}
