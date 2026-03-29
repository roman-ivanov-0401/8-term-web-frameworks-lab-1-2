import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../../../services/httpService';

// Raw API types
type ApiCategory = {
	category_id: number;
	name: string;
	description: string;
};

type ApiIngredient = {
	ingredient_id: number;
	name: string;
	description: string;
	color: string;
};

type ApiDrinkListItem = {
	drink_id: number;
	name: string;
	image: string;
	score: number | null;
	isInFavorites: boolean;
	category: { category_id: number; name: string };
};

type ApiDrinksListResponse = {
	items: ApiDrinkListItem[];
	total: number;
	page: number;
};

type ApiDrinkDetail = {
	drink_id: number;
	name: string;
	description: string;
	category: { category_id: number; name: string; description: string };
	ingredients: DrinkIngredient[];
	user_rating: number | null;
	isInFavorites: boolean;
};

// Exported mapped types
export type Category = {
	categoryId: number;
	name: string;
};

export type IngredientOption = {
	ingredientId: number;
	name: string;
};

export type DrinkListItem = {
	drinkId: number;
	name: string;
	image: string;
	score: number | null;
	isInFavorites: boolean;
	categoryId: number;
};

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

export type DrinksFilter = {
	search?: string;
	categoryIds?: number[];
	ingredientIds?: number[];
	page?: number;
};

export const catalogApi = createApi({
	reducerPath: 'catalogApi',
	baseQuery: baseQueryWithAuth,
	tagTypes: ['Drink', 'Category', 'Ingredient'],
	endpoints: (builder) => ({
		getDrinks: builder.query<DrinkListItem[], DrinksFilter | void>({
			query: (filter) => ({
				url: '/drinks',
				params: {
					search: filter?.search,
					category_ids: filter?.categoryIds,
					ingredients: filter?.ingredientIds,
					page: filter?.page,
				},
			}),
			transformResponse: (res: ApiDrinksListResponse) =>
				res.items.map((d) => ({
					drinkId: d.drink_id,
					name: d.name,
					image: d.image,
					score: d.score,
					isInFavorites: d.isInFavorites,
					categoryId: d.category.category_id,
				})),
			providesTags: (result) =>
				result
					? [...result.map(({ drinkId }) => ({ type: 'Drink' as const, id: drinkId })), 'Drink']
					: ['Drink'],
			keepUnusedDataFor: 60,
		}),

		getDrink: builder.query<DrinkDetail, number>({
			query: (drinkId) => `/drinks/${drinkId}`,
			transformResponse: (d: ApiDrinkDetail) => ({
				drinkId: d.drink_id,
				name: d.name,
				description: d.description,
				category: { categoryId: d.category.category_id, name: d.category.name },
				ingredients: d.ingredients,
				userRating: d.user_rating,
				isInFavorites: d.isInFavorites,
			}),
			providesTags: (result, error, id) => [{ type: 'Drink', id }],
			keepUnusedDataFor: 60,
		}),

		getCategories: builder.query<Category[], void>({
			query: () => '/categories',
			transformResponse: (res: ApiCategory[]) =>
				res.map((c) => ({ categoryId: c.category_id, name: c.name })),
			providesTags: ['Category'],
			keepUnusedDataFor: 600,
		}),

		getIngredients: builder.query<IngredientOption[], string | void>({
			query: (search) => ({
				url: '/ingredients',
				params: search ? { search } : undefined,
			}),
			transformResponse: (res: ApiIngredient[]) =>
				res.map((i) => ({ ingredientId: i.ingredient_id, name: i.name })),
			providesTags: (result, error, search) =>
				search ? [{ type: 'Ingredient', id: search }] : ['Ingredient'],
			keepUnusedDataFor: 600,
		}),

		toggleFavorite: builder.mutation<{ added: boolean }, { userId: number; drinkId: number }>({
			query: ({ userId, drinkId }) => ({
				url: `/users/${userId}/favorites`,
				method: 'POST',
				body: { drink_id: drinkId },
			}),
			invalidatesTags: (result, error, { drinkId }) => [{ type: 'Drink', id: drinkId }],
			async onQueryStarted({ userId, drinkId }, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					if (data.added) {
						dispatch(
							catalogApi.endpoints.updateDrinkRating.initiate({ userId, drinkId, rating: 0 }),
						);
					}
				} catch {
					/* handled by baseQueryWithAuth */
				}
			},
		}),

		updateDrinkRating: builder.mutation<
			{ drink_id: number; rating: number },
			{ userId: number; drinkId: number; rating: number }
		>({
			query: ({ userId, drinkId, rating }) => ({
				url: `/users/${userId}/favorites/${drinkId}`,
				method: 'PUT',
				body: { rating },
			}),
			invalidatesTags: (result, error, { drinkId }) => [{ type: 'Drink', id: drinkId }],
		}),
	}),
});

export const {
	useGetDrinksQuery,
	useGetDrinkQuery,
	useGetCategoriesQuery,
	useGetIngredientsQuery,
	useToggleFavoriteMutation,
	useUpdateDrinkRatingMutation,
} = catalogApi;
