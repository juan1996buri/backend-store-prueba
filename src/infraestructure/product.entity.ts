import { Category } from 'src/infraestructure/category.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column()
  image: string;

  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.product, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'id_category' })
  category: Category;
}
