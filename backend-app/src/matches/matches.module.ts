import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEntity } from '../favorites/favorite.entity';
import { UserProfileEntity } from '../users/user-profile.entity';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity, UserProfileEntity])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
