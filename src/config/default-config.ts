import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Category } from 'src/infraestructure/category.entity';
import { Product } from 'src/infraestructure/product.entity';
import { Role } from 'src/infraestructure/role.entity';
import { User } from 'src/infraestructure/user.entity';

export const setDefaultConfig = async (config: ConfigService) => {
  //console.log(await myDataSource.getRepository(User).find());
  /*
  const defaultUser = await userRepository
    .createQueryBuilder()
    .where('email = :email', {
      email: config.get<string>('DEFAULT_USER_EMAIL'),
    })
    .getOne();

  if (!defaultUser) {
    const adminUser = userRepository.create({
      email: config.get<string>(DEFAULT_USER_EMAIL),
      password: config.get<string>(DEFAULT_USER_PASSWORD),
      roles: ['ADMIN'],
    });

    return await userRepository.save(adminUser);
  }*/
};
