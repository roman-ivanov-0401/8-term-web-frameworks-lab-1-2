import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { IngredientEntity } from './ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly repo: Repository<IngredientEntity>,
  ) {}

  findAll(search?: string) {
    const where = search ? { name: ILike(`%${search}%`) } : {};
    return this.repo.find({ where, order: { ingredient_id: 'ASC' } });
  }
}
