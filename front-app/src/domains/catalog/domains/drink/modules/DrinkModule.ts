import { authModule } from '../../../../auth/modules/AuthModule';
import { catalogRepository } from '../../../repositories/catalogRepository';

export type DrinkIngredient = {
	ingredient_id: number;
	name: string;
	color: string;
	percent: number;
	description: string;
};

export type DrinkDetail = {
	drinkId: number;
	name: string;
	description: string;
	category: { categoryId: number; name: string };
	ingredients: DrinkIngredient[];
	userRating: number | null;
	isInFavorites: boolean;
};

export const drinkModule = {
	getDrink: async (drinkId: number): Promise<DrinkDetail> => {
		const d = await catalogRepository.getDrink(drinkId);
		return {
			drinkId: d.drink_id,
			name: d.name,
			description: d.description,
			category: { categoryId: d.category.category_id, name: d.category.name },
			ingredients: d.ingredients,
			userRating: d.user_rating,
			isInFavorites: d.user_rating !== null,
		};
	},

	toggleFavorite: async (drinkId: number): Promise<{ isFavorite: boolean; rating: number }> => {
		const me = await authModule.me();
		const { added } = await catalogRepository.toggleFavorite(me.user_id, drinkId);
		if (added) {
			await catalogRepository.updateDrinkRating(me.user_id, drinkId, 0);
		}
		return { isFavorite: added, rating: 0 };
	},

	updateRating: async (drinkId: number, rating: number): Promise<void> => {
		const me = await authModule.me();
		await catalogRepository.updateDrinkRating(me.user_id, drinkId, rating);
	},
};
