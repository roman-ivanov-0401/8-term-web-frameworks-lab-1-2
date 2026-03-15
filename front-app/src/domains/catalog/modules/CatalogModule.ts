import { catalogRepository } from '../repositories/catalogRepository';

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
	getDrinks: async (filter?: DrinksFilter): Promise<DrinkListItem[]> => {
		const result = await catalogRepository.getDrinks({
			search: filter?.search,
			category_ids: filter?.categoryIds,
			ingredients: filter?.ingredientIds,
			page: filter?.page,
		});
		return result.items.map((d) => ({
			drinkId: d.drink_id,
			name: d.name,
			image: d.image,
			score: d.score,
			isInFavorites: d.isInFavorites,
			categoryId: d.category.category_id,
		}));
	},

	getCategories: async (): Promise<Category[]> => {
		const categories = await catalogRepository.getCategories();
		return categories.map((c) => ({ categoryId: c.category_id, name: c.name }));
	},

	getIngredients: async (search?: string): Promise<IngredientOption[]> => {
		const ingredients = await catalogRepository.getIngredients(search);
		return ingredients.map((i) => ({ ingredientId: i.ingredient_id, name: i.name }));
	},
};
