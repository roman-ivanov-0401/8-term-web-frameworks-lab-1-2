import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { MeResponse } from '../shared';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refresh_token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any): Promise<MeResponse> {
    const user = await this.usersService.findById(req.user.user_id);
    return {
      user_id: Number(user!.user_id),
      user_name: user!.user_name,
      email: user!.email,
      user_profile_id: null as any,
      user_description: '',
      photo_path: null,
      social_links: [],
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: any) {
    await this.authService.revokeAllForUser(req.user.user_id);
  }
}
