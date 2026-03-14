import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
