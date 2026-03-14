import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':user_id')
  getProfile(@Param('user_id', ParseIntPipe) userId: number) {
    return this.usersService.getProfile(userId);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  updateProfile(
    @CurrentUser() user: { user_id: number },
    @Body() dto: UpdateProfileDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(user.user_id, dto, photo);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  deleteProfile(@CurrentUser() user: { user_id: number }) {
    return this.usersService.deleteProfile(user.user_id);
  }

  @Post(':user_id/social-links')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  addSocialLink(
    @CurrentUser() user: { user_id: number },
    @Param('user_id', ParseIntPipe) targetUserId: number,
    @Body() dto: CreateSocialLinkDto,
  ) {
    return this.usersService.addSocialLink(user.user_id, targetUserId, dto.link);
  }

  @Delete(':user_id/social-links/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  removeSocialLink(
    @CurrentUser() user: { user_id: number },
    @Param('user_id', ParseIntPipe) targetUserId: number,
    @Param('id', ParseIntPipe) linkId: number,
  ) {
    return this.usersService.removeSocialLink(user.user_id, targetUserId, linkId);
  }
}
