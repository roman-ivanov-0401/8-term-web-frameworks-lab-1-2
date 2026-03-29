import { authModule } from '../../../../auth/modules/AuthModule';
import { catalogRepository } from '../../../repositories/catalogRepository';
import { drinkStore } from '../models/drinkModel';

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
	getDrink: async (drinkId: number): Promise<void> => {
		const d = await catalogRepository.getDrink(drinkId);
		const drink: DrinkDetail = {
			drinkId: d.drink_id,
			name: d.name,
			description: d.description,
			category: { categoryId: d.category.category_id, name: d.category.name },
			ingredients: d.ingredients,
			userRating: d.user_rating,
			isInFavorites: d.user_rating !== null,
		};
		drinkStore.setDrink(drink);
		drinkStore.setIsFavorite(drink.isInFavorites);
		drinkStore.setRating(drink.userRating ?? 0);
	},

	toggleFavorite: async (drinkId: number): Promise<void> => {
		const me = await authModule.me();
		const { added } = await catalogRepository.toggleFavorite(me.user_id, drinkId);
		if (added) {
			await catalogRepository.updateDrinkRating(me.user_id, drinkId, 0);
		}
		drinkStore.setIsFavorite(added);
		drinkStore.setRating(0);
	},

	updateRating: async (drinkId: number, rating: number): Promise<void> => {
		const me = await authModule.me();
		await catalogRepository.updateDrinkRating(me.user_id, drinkId, rating);
	},
};
