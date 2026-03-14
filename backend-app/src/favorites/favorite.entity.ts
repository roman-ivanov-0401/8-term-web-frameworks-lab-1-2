import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { DrinkEntity } from '../drinks/drink.entity';

@Entity('favorites_user_drinks')
export class FavoriteEntity {
  @PrimaryColumn({ type: 'bigint' })
  user_id: number;

  @PrimaryColumn({ type: 'bigint' })
  drink_id: number;

  @Column({ type: 'smallint', nullable: true })
  rating: number;

  @ManyToOne(() => DrinkEntity, { eager: true })
  @JoinColumn({ name: 'drink_id' })
  drink: DrinkEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modified_at: Date;
}
