import {
  Post,
  Body,
  Param,
  Delete,
  Put,
  Controller,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/roles/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/roles/guard/roles.guard';
import { TypesRoles } from 'src/common/emun/tyes-roles';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(TypesRoles.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.categoryService.create(dto, image);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.categoryService.findOne(id);
  }

  @Put()
  async update(@Body() dto: UpdateCategoryDto) {
    return await this.categoryService.update(dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.categoryService.remove(id);
  }
}
