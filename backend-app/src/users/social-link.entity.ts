import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';

@Entity('social_links')
export class SocialLinkEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'social_link_id' })
  social_link_id: number;

  @Column({ type: 'bigint' })
  user_profile_id: number;

  @Column({ type: 'varchar', length: 255 })
  link: string;

  @ManyToOne(() => UserProfileEntity, (up) => up.socialLinks)
  @JoinColumn({ name: 'user_profile_id' })
  userProfile: UserProfileEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modified_at: Date;
}
