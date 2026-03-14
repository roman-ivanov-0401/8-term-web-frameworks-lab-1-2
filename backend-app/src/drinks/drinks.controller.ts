import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { DrinksService } from './drinks.service';
import { GetDrinksDto } from './dto/get-drinks.dto';
import { Request } from 'express';

@ApiTags('Drinks')
@Controller('drinks')
export class DrinksController {
  constructor(private readonly drinksService: DrinksService) {}

  @Get()
  getList(@Query() dto: GetDrinksDto, @Req() req: Request) {
    const user = (req as any).user;
    return this.drinksService.getList(dto, user?.user_id);
  }

  @Get(':drink_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getById(
    @Param('drink_id', ParseIntPipe) drinkId: number,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.drinksService.getById(drinkId, user?.user_id);
  }
}
