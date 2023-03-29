import {
  IsString,
  IsInt,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';

export class CreateUserDto {
  @IsOptional()
  @IsInt()
  id: number;

  @IsEmail({}, { message: 'El correo electronico no es valido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: ' El password debe tener minimo 5 caracteres',
  })
  password: string;

  @IsOptional()
  state: boolean;

  @IsOptional()
  role: CreateRoleDto;
}
