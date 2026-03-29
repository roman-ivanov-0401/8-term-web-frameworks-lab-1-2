import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../../../services/httpService';

type ApiCommonDrink = {
	drink_id: number;
	name: string;
};

type ApiMatch = {
	user_id: number;
	user_name: string;
	photo_path: string | null;
	user_description: string;
	match_score: number;
	common_drinks: ApiCommonDrink[];
};

export type MatchItem = {
	userId: number;
	userName: string;
	initials: string;
	score: number;
	description: string;
	commonDrinks: string[];
};

function getInitials(name: string): string {
	return name
		.split(' ')
		.map((w) => w[0] ?? '')
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

export const matchesApi = createApi({
	reducerPath: 'matchesApi',
	baseQuery: baseQueryWithAuth,
	tagTypes: ['Match'],
	endpoints: (builder) => ({
		getMatches: builder.query<MatchItem[], void>({
			query: () => '/matches',
			transformResponse: (res: ApiMatch[]) =>
				res.map((m) => ({
					userId: m.user_id,
					userName: m.user_name,
					initials: getInitials(m.user_name),
					score: m.match_score,
					description: m.user_description,
					commonDrinks: m.common_drinks.map((d) => d.name),
				})),
			providesTags: ['Match'],
			keepUnusedDataFor: 60,
		}),
	}),
});

export const { useGetMatchesQuery } = matchesApi;
