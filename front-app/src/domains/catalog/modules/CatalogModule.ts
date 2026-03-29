import { catalogRepository } from '../repositories/catalogRepository';
import { catalogStore } from '../models/catalogModel';

export type DrinkListItem = {
	drinkId: number;
	name: string;
	image: string;
	score: number | null;
	isInFavorites: boolean;
	categoryId: number;
};

export type Category = {
	categoryId: number;
	name: string;
};

export type IngredientOption = {
	ingredientId: number;
	name: string;
};

export type DrinksFilter = {
	search?: string;
	categoryIds?: number[];
	ingredientIds?: number[];
	page?: number;
};

export const catalogModule = {
	getDrinks: async (filter?: DrinksFilter): Promise<void> => {
		catalogStore.setLoading(true);
		try {
			const result = await catalogRepository.getDrinks({
				search: filter?.search,
				category_ids: filter?.categoryIds,
				ingredients: filter?.ingredientIds,
				page: filter?.page,
			});
			catalogStore.setDrinks(result.items.map((d) => ({
				drinkId: d.drink_id,
				name: d.name,
				image: d.image,
				score: d.score,
				isInFavorites: d.isInFavorites,
				categoryId: d.category.category_id,
			})));
		} finally {
			catalogStore.setLoading(false);
		}
	},

	getCategories: async (): Promise<void> => {
		const categories = await catalogRepository.getCategories();
		catalogStore.setCategories(categories.map((c) => ({ categoryId: c.category_id, name: c.name })));
	},

	getIngredients: async (search?: string): Promise<void> => {
		const ingredients = await catalogRepository.getIngredients(search);
		catalogStore.setIngredientOptions(ingredients.map((i) => ({ ingredientId: i.ingredient_id, name: i.name })));
	},
};
