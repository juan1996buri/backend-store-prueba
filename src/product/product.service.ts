import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/infraestructure/category.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, PaginationQueryDto, UpdateProductDto } from './dto';
import { Product } from '../infraestructure/product.entity';

import { paginate } from 'nestjs-typeorm-paginate';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    private cloudinary: CloudinaryService,
  ) {}
  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    let image;
    if (file) image = await this.uploadImageToCloudinary(file);
    if (image?.url) createProductDto.image = image.url;
    const newProduct = this.repository.create(createProductDto);
    return await this.repository.save(newProduct);
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file, 'product').catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async findAll(pagination: PaginationQueryDto) {
    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.category', 'category')
      .where('category.name LIKE :name', { name: pagination.category });
    queryBuilder.orderBy('product.name', 'ASC');
    return paginate<Product>(queryBuilder, pagination);
  }

  async findOne(id: number) {
    const data = await this.repository.findOneBy({ id });
    if (!data) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Producto no encontrado',
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Producto no encontrado',
      };
    }
  }

  async update(dto: UpdateProductDto) {
    try {
      const { affected } = await this.repository.update({ id: dto.id }, dto);
      if (affected == 1) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Producto actualizado con exito',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Producto no encontrado',
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
          message: 'Producto eliminado correctamente',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Este producto no existe',
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
