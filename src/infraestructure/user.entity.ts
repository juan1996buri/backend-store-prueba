import { Role } from 'src/infraestructure/role.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'bool', default: true })
  state: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'create_at' })
  createAt: Date;

  @ManyToOne(() => Role, (role) => role.user, { eager: true, nullable: false })
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  async hasPassword() {
    if (!this.password) {
      return;
    }
    this.password = await bcrypt.hash(this.password, 10);
  }

  //@OneToMany(() => Favorite, (favorite) => favorite.user)
  //favorite: Favorite[];
}
