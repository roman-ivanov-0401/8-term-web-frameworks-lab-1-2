import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEntity } from '../favorites/favorite.entity';
import { UserProfileEntity } from '../users/user-profile.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favRepo: Repository<FavoriteEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly profileRepo: Repository<UserProfileEntity>,
  ) {}

  async getMatches(userId: number) {
    // 1. Get current user's favorite drink IDs
    const myFavorites = await this.favRepo.find({
      where: { user_id: userId },
      select: ['drink_id'],
    });
    const myDrinkIds = myFavorites.map((f) => Number(f.drink_id));

    if (myDrinkIds.length === 0) {
      return [];
    }

    // 2. Find other users who have at least 1 common drink
    const otherFavorites = await this.favRepo
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.drink', 'd')
      .where('f.user_id != :userId', { userId })
      .andWhere('f.drink_id IN (:...drinkIds)', { drinkIds: myDrinkIds })
      .getMany();

    // Group by user
    const userDrinksMap = new Map<
      number,
      Array<{ drink_id: number; name: string }>
    >();
    for (const fav of otherFavorites) {
      const uid = Number(fav.user_id);
      if (!userDrinksMap.has(uid)) {
        userDrinksMap.set(uid, []);
      }
      userDrinksMap.get(uid)!.push({
        drink_id: Number(fav.drink_id),
        name: fav.drink.name,
      });
    }

    // 3. Get total favorite counts for other users
    const otherUserIds = [...userDrinksMap.keys()];
    if (otherUserIds.length === 0) {
      return [];
    }

    const counts = await this.favRepo
      .createQueryBuilder('f')
      .select('f.user_id', 'user_id')
      .addSelect('COUNT(*)', 'cnt')
      .where('f.user_id IN (:...userIds)', { userIds: otherUserIds })
      .groupBy('f.user_id')
      .getRawMany();

    const countMap = new Map<number, number>();
    for (const row of counts) {
      countMap.set(Number(row.user_id), Number(row.cnt));
    }

    // 4. Calculate match scores
    const results: Array<{
      user_id: number;
      match_score: number;
      common_drinks: Array<{ drink_id: number; name: string }>;
    }> = [];

    for (const [uid, commonDrinks] of userDrinksMap) {
      const theirCount = countMap.get(uid) || commonDrinks.length;
      const matchScore =
        commonDrinks.length / Math.max(myDrinkIds.length, theirCount);
      results.push({
        user_id: uid,
        match_score: Math.round(matchScore * 100) / 100,
        common_drinks: commonDrinks,
      });
    }

    results.sort((a, b) => b.match_score - a.match_score);

    // 5. Enrich with profile data
    const profiles = await this.profileRepo
      .createQueryBuilder('p')
      .where('p.user_id IN (:...userIds)', {
        userIds: results.map((r) => r.user_id),
      })
      .getMany();

    const profileMap = new Map<number, UserProfileEntity>();
    for (const p of profiles) {
      profileMap.set(Number(p.user_id), p);
    }

    return results.map((r) => {
      const profile = profileMap.get(r.user_id);
      return {
        user_id: r.user_id,
        user_name: '',
        photo_path: profile?.photo_path ?? null,
        user_description: profile?.user_description ?? '',
        match_score: r.match_score,
        common_drinks: r.common_drinks,
      };
    });
  }
}
