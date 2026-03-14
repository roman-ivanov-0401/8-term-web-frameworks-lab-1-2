import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrinkEntity } from './drink.entity';
import { DrinkIngredientEntity } from './drink-ingredient.entity';
import { GetDrinksDto } from './dto/get-drinks.dto';

@Injectable()
export class DrinksService {
  constructor(
    @InjectRepository(DrinkEntity)
    private readonly drinkRepo: Repository<DrinkEntity>,
    @InjectRepository(DrinkIngredientEntity)
    private readonly diRepo: Repository<DrinkIngredientEntity>,
  ) {}

  async getList(dto: GetDrinksDto, userId?: number) {
    const page = Number(dto.page) || 1;
    const perPage = Number(dto.per_page) || 20;

    const qb = this.drinkRepo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.category', 'c');

    // LEFT JOIN favorites to get isInFavorites & score
    qb.leftJoin(
      'favorites_user_drinks',
      'f',
      'f.drink_id = d.drink_id AND f.user_id = :userId',
      { userId: userId ?? 0 },
    );
    qb.addSelect('f.rating', 'f_rating');
    qb.addSelect('f.user_id', 'f_user_id');

    if (dto.category_ids?.length) {
      qb.andWhere('d.category_id IN (:...categoryIds)', {
        categoryIds: dto.category_ids,
      });
    }

    if (dto.ingredients?.length) {
      qb.andWhere(
        `d.drink_id IN (
          SELECT di.drink_id FROM drinks_ingredients di
          WHERE di.ingredient_id IN (:...ingredientIds)
        )`,
        { ingredientIds: dto.ingredients },
      );
    }

    if (dto.search) {
      qb.andWhere('d.name ILIKE :search', { search: `%${dto.search}%` });
    }

    const total = await qb.getCount();

    const raw = await qb
      .orderBy('d.drink_id', 'ASC')
      .skip((page - 1) * perPage)
      .take(perPage)
      .getRawAndEntities();

    const items = raw.entities.map((drink, i) => {
      const r = raw.raw[i];
      return {
        drink_id: Number(drink.drink_id),
        name: drink.name,
        description: drink.description,
        image: drink.image,
        category: {
          category_id: drink.category.category_id,
          name: drink.category.name,
        },
        isInFavorites: userId ? !!r.f_user_id : false,
        score: userId && r.f_user_id ? r.f_rating : null,
      };
    });

    return { items, total, page, per_page: perPage };
  }

  async getById(drinkId: number, userId?: number) {
    const drink = await this.drinkRepo.findOne({
      where: { drink_id: drinkId },
      relations: ['category', 'drinkIngredients', 'drinkIngredients.ingredient'],
    });

    if (!drink) {
      throw new NotFoundException('Drink not found');
    }

    // Get user rating if authenticated
    let userRating: number | null = null;
    if (userId) {
      const fav = await this.drinkRepo.manager
        .createQueryBuilder()
        .select('f.rating', 'rating')
        .from('favorites_user_drinks', 'f')
        .where('f.drink_id = :drinkId AND f.user_id = :userId', {
          drinkId,
          userId,
        })
        .getRawOne();
      userRating = fav?.rating ?? null;
    }

    return {
      drink_id: Number(drink.drink_id),
      name: drink.name,
      description: drink.description,
      category: {
        category_id: drink.category.category_id,
        name: drink.category.name,
        description: drink.category.description,
      },
      ingredients: drink.drinkIngredients.map((di) => ({
        ingredient_id: di.ingredient.ingredient_id,
        name: di.ingredient.name,
        description: di.ingredient.description,
        color: di.ingredient.color,
        percent: di.percent,
      })),
      user_rating: userRating,
      created_at: drink.created_at.toISOString(),
      modified_at: drink.modified_at.toISOString(),
    };
  }
}
