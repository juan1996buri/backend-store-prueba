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
  async create(dto: CreateProductDto, file: Express.Multer.File) {
    try {
      let image;
      if (file) image = await this.uploadImageToCloudinary(file);
      if (image?.url) dto.image = image.url;
      const product = await this.repository.findOne({
        where: { name: dto.name },
      });
      if (!product) {
        const newProduct = this.repository.create(dto);
        const data = await this.repository.save(newProduct);
        return {
          statusCode: HttpStatus.OK,
          message: 'Producto creado con exito',
          data,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Este producto ya existe',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file, 'product').catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }
  async update(dto: UpdateProductDto, file: Express.Multer.File) {
    try {
      let image;
      if (file) image = await this.uploadImageToCloudinary(file);
      if (image?.url) dto.image = image.url;
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

  async findAll(pagination: PaginationQueryDto) {
    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.category', 'category');
    //.where('category.name LIKE :name', { name: pagination.category });
    queryBuilder.orderBy('product.name', 'ASC');

    if ((await queryBuilder.getRawMany()).length == 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No existen productos no encontrado',
      };
    }
    const data = await paginate<Product>(queryBuilder, pagination);
    return {
      statusCode: HttpStatus.OK,
      message: 'Productos encontrados',
      data,
    };
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
        statusCode: HttpStatus.OK,
        message: 'Producto encontrado',
        data,
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
