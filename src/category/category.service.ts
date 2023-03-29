import { HttpStatus, Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../infraestructure/category.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    private cloudinary: CloudinaryService,
  ) {}
  async create(dto: CreateCategoryDto, file: Express.Multer.File) {
    try {
      let image;
      if (file) image = await this.uploadImageToCloudinary(file);
      if (image?.url) dto.image = image.url;
      const newCategory = this.repository.create(dto);
      const data = await this.repository.save(newCategory);
      return {
        statusCode: HttpStatus.OK,
        message: 'La Categorias se ha creado con exito',
        data,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file, 'category').catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async findAll() {
    const data = await this.repository.find();
    if (data.length === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No existen categorias',
      };
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Categorias econtradas',
      data,
    };
  }

  async findOne(id: number) {
    try {
      const data = await this.repository.findOneBy({ id });
      if (!data) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Categoria no encontrado',
        };
      } else
        return {
          statusCode: HttpStatus.OK,
          message: 'Categoria encontrado',
          data,
        };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async update(dto: UpdateCategoryDto) {
    try {
      const { affected } = await this.repository.update({ id: dto.id }, dto);
      if (affected == 1) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Categoria actualizado con exito',
        };
      } else {
        return {
          statusCode: HttpStatus.OK,
          message: 'Categoria no encontrado',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async remove(id: number) {
    try {
      const { affected } = await this.repository.delete({ id });
      if (affected == 1) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Categoria eliminado correctamente',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Esta categoria no existe',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
