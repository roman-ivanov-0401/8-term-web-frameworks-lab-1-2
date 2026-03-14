import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SocialLinkEntity } from './social-link.entity';

@Entity('user_profile')
export class UserProfileEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'user_profile_id' })
  user_profile_id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  user_description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  photo_path: string;

  @OneToMany(() => SocialLinkEntity, (sl) => sl.userProfile, { eager: true })
  socialLinks: SocialLinkEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modified_at: Date;
}
