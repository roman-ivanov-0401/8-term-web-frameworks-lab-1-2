import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';
import { DrinkIngredientEntity } from './drink-ingredient.entity';

@Entity('drinks')
export class DrinkEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'drink_id' })
  drink_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  image: string;

  @Column({ type: 'smallint' })
  category_id: number;

  @ManyToOne(() => CategoryEntity, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => DrinkIngredientEntity, (di) => di.drink)
  drinkIngredients: DrinkIngredientEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modified_at: Date;
}
