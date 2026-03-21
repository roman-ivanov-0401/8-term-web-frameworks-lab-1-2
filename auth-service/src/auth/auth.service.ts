import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse, JwtPayload } from '../shared';
import { RefreshToken } from './refresh-token.entity';

const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
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

    const userId = Number(user.user_id);
    const payload: JwtPayload = { sub: userId, email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_EXPIRES });
    const refresh_token = await this.createRefreshToken(userId);

    return {
      token,
      refresh_token,
      user: {
        user_id: userId,
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

    const userId = Number(user.user_id);
    const payload: JwtPayload = { sub: userId, email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_EXPIRES });
    const refresh_token = await this.createRefreshToken(userId);

    return {
      token,
      refresh_token,
      user: {
        user_id: userId,
        user_name: user.user_name,
        email: user.email,
      },
    };
  }

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokenHash = this.hashToken(refreshToken);

    const stored = await this.refreshTokenRepo.findOne({
      where: { token_hash: tokenHash, revoked: false },
    });

    if (!stored || new Date() > stored.expires_at) {
      if (stored) {
        stored.revoked = true;
        await this.refreshTokenRepo.save(stored);
      }
      throw new UnauthorizedException({
        error: { code: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid or expired' },
      });
    }

    // Rotate: revoke old token
    stored.revoked = true;
    await this.refreshTokenRepo.save(stored);

    const user = await this.usersService.findById(Number(stored.user_id));
    if (!user) {
      throw new UnauthorizedException({
        error: { code: 'USER_NOT_FOUND', message: 'User not found' },
      });
    }

    const userId = Number(user.user_id);
    const payload: JwtPayload = { sub: userId, email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_EXPIRES });
    const newRefreshToken = await this.createRefreshToken(userId);

    return {
      token,
      refresh_token: newRefreshToken,
      user: {
        user_id: userId,
        user_name: user.user_name,
        email: user.email,
      },
    };
  }

  async revokeAllForUser(userId: number): Promise<void> {
    await this.refreshTokenRepo.update(
      { user_id: userId, revoked: false },
      { revoked: true },
    );
  }

  private async createRefreshToken(userId: number): Promise<string> {
    const rawToken = crypto.randomUUID();
    const tokenHash = this.hashToken(rawToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

    await this.refreshTokenRepo.save(
      this.refreshTokenRepo.create({
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt,
      }),
    );

    return rawToken;
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
