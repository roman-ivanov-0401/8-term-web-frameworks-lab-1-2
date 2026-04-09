import { axiosInstance } from '@app/shared';

type DrinkCategory = {
	category_id: number;
	name: string;
};

type DrinkListItem = {
	drink_id: number;
	name: string;
	description: string;
	image: string;
	score: number | null;
	isInFavorites: boolean;
	category: DrinkCategory;
};

type DrinkIngredient = {
	ingredient_id: number;
	name: string;
	description: string;
	color: string;
	percent: number;
};

type DrinkDetail = {
	drink_id: number;
	name: string;
	description: string;
	category: DrinkCategory & { description: string };
	ingredients: DrinkIngredient[];
	user_rating: number | null;
	isInFavorites: boolean;
	created_at: string;
	modified_at: string;
};

type DrinksListResponse = {
	items: DrinkListItem[];
	total: number;
	page: number;
};

type DrinksListParams = {
	page?: number;
	per_page?: number;
	category_ids?: number[];
	ingredients?: number[];
	search?: string;
};

type Category = {
	category_id: number;
	name: string;
	description: string;
};

type Ingredient = {
	ingredient_id: number;
	name: string;
	description: string;
	color: string;
};

export const catalogRepository = {
	getDrinks: async (params?: DrinksListParams): Promise<DrinksListResponse> => {
		const { data } = await axiosInstance.get<DrinksListResponse>('/drinks', { params });
		return data;
	},

	getDrink: async (drinkId: number): Promise<DrinkDetail> => {
		const { data } = await axiosInstance.get<DrinkDetail>(`/drinks/${drinkId}`);
		return data;
	},

	getCategories: async (): Promise<Category[]> => {
		const { data } = await axiosInstance.get<Category[]>('/categories');
		return data;
	},

	getIngredients: async (search?: string): Promise<Ingredient[]> => {
		const { data } = await axiosInstance.get<Ingredient[]>('/ingredients', { params: { search } });
		return data;
	},

	toggleFavorite: async (userId: number, drinkId: number): Promise<{ added: boolean }> => {
		const { data } = await axiosInstance.post<{ added: boolean }>(
			`/users/${userId}/favorites`,
			{ drink_id: drinkId },
		);
		return data;
	},

	updateDrinkRating: async (userId: number, drinkId: number, rating: number): Promise<{ drink_id: number; rating: number }> => {
		const { data } = await axiosInstance.put<{ drink_id: number; rating: number }>(
			`/users/${userId}/favorites/${drinkId}`,
			{ rating },
		);
		return data;
	},
};
