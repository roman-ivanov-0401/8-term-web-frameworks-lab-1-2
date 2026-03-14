import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_profile')
export class UserProfile {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'user_profile_id' })
  user_profile_id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  user_description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  photo_path: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modified_at: Date;
}
