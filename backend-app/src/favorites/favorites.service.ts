import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEntity } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly repo: Repository<FavoriteEntity>,
  ) {}

  private ensureOwner(currentUserId: number, targetUserId: number) {
    if (currentUserId !== targetUserId) {
      throw new ForbiddenException('Cannot access another user\'s favorites');
    }
  }

  async getFavorites(
    currentUserId: number,
    targetUserId: number,
    page = 1,
    perPage = 20,
  ) {
    this.ensureOwner(currentUserId, targetUserId);

    const [items, total] = await this.repo.findAndCount({
      where: { user_id: targetUserId },
      relations: ['drink', 'drink.category'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      items: items.map((f) => ({
        drink_id: Number(f.drink_id),
        name: f.drink.name,
        description: f.drink.description,
        category: {
          category_id: f.drink.category.category_id,
          name: f.drink.category.name,
        },
        rating: f.rating,
        created_at: f.created_at.toISOString(),
        modified_at: f.modified_at.toISOString(),
      })),
      total,
      page,
      per_page: perPage,
    };
  }

  async toggle(currentUserId: number, targetUserId: number, drinkId: number) {
    this.ensureOwner(currentUserId, targetUserId);

    const existing = await this.repo.findOne({
      where: { user_id: targetUserId, drink_id: drinkId },
    });

    if (existing) {
      await this.repo.remove(existing);
      return { added: false };
    }

    await this.repo.save(
      this.repo.create({ user_id: targetUserId, drink_id: drinkId }),
    );
    return { added: true };
  }

  async updateRating(
    currentUserId: number,
    targetUserId: number,
    drinkId: number,
    rating: number,
  ) {
    this.ensureOwner(currentUserId, targetUserId);

    const fav = await this.repo.findOne({
      where: { user_id: targetUserId, drink_id: drinkId },
    });
    if (!fav) {
      throw new NotFoundException('Favorite not found');
    }

    fav.rating = rating;
    await this.repo.save(fav);
    return fav;
  }

  async remove(currentUserId: number, targetUserId: number, drinkId: number) {
    this.ensureOwner(currentUserId, targetUserId);

    const fav = await this.repo.findOne({
      where: { user_id: targetUserId, drink_id: drinkId },
    });
    if (!fav) {
      throw new NotFoundException('Favorite not found');
    }

    await this.repo.remove(fav);
  }
}
