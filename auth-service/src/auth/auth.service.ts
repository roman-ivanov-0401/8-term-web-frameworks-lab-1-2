import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse, JwtPayload } from '../shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException({
        error: { code: 'EMAIL_TAKEN', message: 'Email already registered' },
      });
    }

    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      user_name: dto.user_name,
      email: dto.email,
      password_hash,
    });

    const payload: JwtPayload = { sub: Number(user.user_id), email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        user_id: Number(user.user_id),
        user_name: user.user_name,
        email: user.email,
      },
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const payload: JwtPayload = { sub: Number(user.user_id), email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        user_id: Number(user.user_id),
        user_name: user.user_name,
        email: user.email,
      },
    };
  }
}
