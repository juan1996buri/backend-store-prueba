import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateRoleDto {
  id: number;
  name: string;
  user: CreateUserDto[];
}
