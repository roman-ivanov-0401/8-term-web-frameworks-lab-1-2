import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'varchar', length: 255 })
  token_hash: string;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
