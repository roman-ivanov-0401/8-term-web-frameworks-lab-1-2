import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { DrinkEntity } from './drink.entity';
import { IngredientEntity } from '../ingredients/ingredient.entity';

@Entity('drinks_ingredients')
export class DrinkIngredientEntity {
  @PrimaryColumn({ type: 'bigint' })
  drink_id: number;

  @PrimaryColumn({ type: 'int' })
  ingredient_id: number;

  @Column({ type: 'float' })
  percent: number;

  @ManyToOne(() => DrinkEntity, (d) => d.drinkIngredients)
  @JoinColumn({ name: 'drink_id' })
  drink: DrinkEntity;

  @ManyToOne(() => IngredientEntity, { eager: true })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: IngredientEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modified_at: Date;
}
