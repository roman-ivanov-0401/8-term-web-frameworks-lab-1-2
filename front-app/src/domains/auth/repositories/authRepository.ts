import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../../services/httpService';
import { localStorageRepository } from '../../../repositories/localStorageRepository';

export type AuthUser = {
	user_id: number;
	user_name: string;
	email: string;
};

export type AuthResponse = {
	token: string;
	refresh_token: string;
	user: AuthUser;
};

export type SocialLink = {
	social_link_id: number;
	link: string;
};

export type MeResponse = {
	user_id: number;
	user_name: string;
	email: string;
	user_profile_id: number;
	user_description: string;
	photo_path: string | null;
	social_links: SocialLink[];
};

export type RegisterPayload = {
	user_name: string;
	email: string;
	password: string;
};

export type LoginPayload = {
	email: string;
	password: string;
};

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: baseQueryWithAuth,
	tagTypes: ['Me'],
	endpoints: (builder) => ({
		login: builder.mutation<AuthResponse, LoginPayload>({
			query: (body) => ({ url: '/auth/login', method: 'POST', body }),
			invalidatesTags: ['Me'],
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					localStorageRepository.set(TOKEN_KEY, data.token);
					localStorageRepository.set(REFRESH_TOKEN_KEY, data.refresh_token);
				} catch {
					/* handled by baseQueryWithAuth */
				}
			},
		}),
		register: builder.mutation<AuthResponse, RegisterPayload>({
			query: (body) => ({ url: '/auth/register', method: 'POST', body }),
			invalidatesTags: ['Me'],
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					localStorageRepository.set(TOKEN_KEY, data.token);
					localStorageRepository.set(REFRESH_TOKEN_KEY, data.refresh_token);
				} catch {
					/* handled by baseQueryWithAuth */
				}
			},
		}),
		me: builder.query<MeResponse, void>({
			query: () => '/auth/me',
			providesTags: ['Me'],
			keepUnusedDataFor: 300,
		}),
		logout: builder.mutation<void, void>({
			query: () => ({ url: '/auth/logout', method: 'POST' }),
			invalidatesTags: ['Me'],
			async onQueryStarted(_, { queryFulfilled }) {
				try {
					await queryFulfilled;
				} finally {
					localStorageRepository.remove(TOKEN_KEY);
					localStorageRepository.remove(REFRESH_TOKEN_KEY);
				}
			},
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation, useMeQuery, useLogoutMutation } = authApi;
