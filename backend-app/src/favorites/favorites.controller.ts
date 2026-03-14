import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { FavoritesService } from './favorites.service';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@ApiTags('Favorites')
@Controller('users/:user_id/favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'per_page', required: false })
  getFavorites(
    @CurrentUser() user: { user_id: number },
    @Param('user_id', ParseIntPipe) targetUserId: number,
    @Query('page') page?: string,
    @Query('per_page') perPage?: string,
  ) {
    return this.favoritesService.getFavorites(
      user.user_id,
      targetUserId,
      Number(page) || 1,
      Number(perPage) || 20,
    );
  }

  @Post()
  toggle(
    @CurrentUser() user: { user_id: number },
    @Param('user_id', ParseIntPipe) targetUserId: number,
    @Body() dto: ToggleFavoriteDto,
  ) {
    return this.favoritesService.toggle(
      user.user_id,
      targetUserId,
      dto.drink_id,
    );
  }

  @Put(':drink_id')
  updateRating(
    @CurrentUser() user: { user_id: number },
    @Param('user_id', ParseIntPipe) targetUserId: number,
    @Param('drink_id', ParseIntPipe) drinkId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.favoritesService.updateRating(
      user.user_id,
      targetUserId,
      drinkId,
      dto.rating,
    );
  }

  @Delete(':drink_id')
  @HttpCode(204)
  remove(
    @CurrentUser() user: { user_id: number },
    @Param('user_id', ParseIntPipe) targetUserId: number,
    @Param('drink_id', ParseIntPipe) drinkId: number,
  ) {
    return this.favoritesService.remove(user.user_id, targetUserId, drinkId);
  }
}
