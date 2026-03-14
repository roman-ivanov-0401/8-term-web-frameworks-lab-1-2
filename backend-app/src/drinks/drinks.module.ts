import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrinkEntity } from './drink.entity';
import { DrinkIngredientEntity } from './drink-ingredient.entity';
import { DrinksService } from './drinks.service';
import { DrinksController } from './drinks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DrinkEntity, DrinkIngredientEntity])],
  controllers: [DrinksController],
  providers: [DrinksService],
  exports: [DrinksService],
})
export class DrinksModule {}
