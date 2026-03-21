import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RefreshToken } from './refresh-token.entity';

@Module({
  imports: [UsersModule, PassportModule, TypeOrmModule.forFeature([RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
