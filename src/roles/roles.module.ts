import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../infraestructure/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
})
export class RolesModule {}
