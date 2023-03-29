import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/infraestructure/role.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../infraestructure/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      const userExist = await this.repository.findOneBy({
        email: dto.email,
      });
      if (userExist) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Este correo ya se encuentra registrado',
        };
      } else {
        const newUser = this.repository.create({ ...dto, role: { id: 2 } });
        const data = await this.repository.save(newUser);
        return {
          statusCode: HttpStatus.OK,
          message: 'Usuario registrado con exito',
          data,
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async findAll() {
    const data = await this.repository.find();
    if (data.length === 0) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'No existen usuario',
      };
    } else
      return {
        statusCode: HttpStatus.OK,
        message: 'Usuarios obtenidos con exito',
        data,
      };
  }

  async findOne(email: string) {
    try {
      const data = await this.repository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.role', 'role')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();

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

  async findUserById(id: number) {
    try {
      const data = await this.repository.findOneBy({ id });
      if (!data) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Usuario no encontrado',
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Usuario encontrado',
        data,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async update(dto: UpdateUserDto) {
    try {
      const { affected } = await this.repository.update(
        { email: dto.email },
        dto,
      );
      if (affected == 1) {
        await this.repository.save(dto);
        return {
          statusCode: HttpStatus.OK,
          message: 'Usuario actualizado con exito',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Usuario no encontrado',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async remove(email: string) {
    try {
      const { affected } = await this.repository.delete({ email });
      if (affected == 1) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Usuario eliminado correctamente',
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Esta Usuario no existe',
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
