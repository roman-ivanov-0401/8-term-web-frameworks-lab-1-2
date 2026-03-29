import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from '../../../services/httpService';
import { setCurrentUser, updateCurrentUser, addSocialLink, removeSocialLink } from '../../../models/currentUserModel';
import { setNewLinkValue } from '../models/profileModel';

type SocialLink = {
	social_link_id: number;
	link: string;
	created_at: string;
	modified_at: string;
};

export type UserProfile = {
	user_profile_id: number;
	user_id: number;
	user_description: string;
	photo_path: string | null;
	social_links: SocialLink[];
};

type UpdateProfilePayload = {
	user_name: string;
	user_description: string;
	photo?: File;
};

type UpdateProfileResponse = {
	user_profile_id: number;
	user_description: string;
	photo_path: string | null;
};

type AddSocialLinkResponse = {
	social_link_id: number;
	link: string;
};

type FavoriteCategory = {
	category_id: number;
	name: string;
};

type FavoriteDrink = {
	drink_id: number;
	name: string;
	description: string;
	category: FavoriteCategory;
	rating: number;
	created_at: string;
	modified_at: string;
};

export type FavoritesResponse = {
	items: FavoriteDrink[];
	total: number;
	page: number;
};

export const profileApi = createApi({
	reducerPath: 'profileApi',
	baseQuery: baseQueryWithAuth,
	tagTypes: ['Profile', 'Favorites'],
	endpoints: (builder) => ({
		getProfile: builder.query<UserProfile, number>({
			query: (userId) => `/users/${userId}`,
			providesTags: (_result, _error, userId) => [{ type: 'Profile', id: userId }],
			keepUnusedDataFor: 300,
		}),

		updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfilePayload>({
			query: (payload) => {
				const formData = new FormData();
				formData.append('user_name', payload.user_name);
				formData.append('user_description', payload.user_description);
				if (payload.photo) formData.append('photo', payload.photo);
				return { url: '/users/me', method: 'PUT', body: formData };
			},
			invalidatesTags: ['Profile'],
			async onQueryStarted(payload, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(updateCurrentUser({
						user_name: payload.user_name,
						user_description: payload.user_description,
						photo_path: data.photo_path,
					}));
				} catch {
					/* handled by baseQueryWithAuth */
				}
			},
		}),

		deleteProfile: builder.mutation<void, void>({
			query: () => ({ url: '/users/me', method: 'DELETE' }),
			invalidatesTags: ['Profile', 'Favorites'],
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					dispatch(setCurrentUser(null));
				} catch {
					/* handled by baseQueryWithAuth */
				}
			},
		}),

		addSocialLink: builder.mutation<AddSocialLinkResponse, { userId: number; link: string }>({
			query: ({ userId, link }) => ({
				url: `/users/${userId}/social-links`,
				method: 'POST',
				body: { link },
			}),
			invalidatesTags: (_result, _error, { userId }) => [{ type: 'Profile', id: userId }],
			async onQueryStarted(_, { queryFulfilled, dispatch }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(addSocialLink({ social_link_id: data.social_link_id, link: data.link, created_at: '', modified_at: '' }));
					dispatch(setNewLinkValue(''));
				} catch {
					/* handled by baseQueryWithAuth */
				}
			},
		}),

		deleteSocialLink: builder.mutation<void, { userId: number; socialLinkId: number }>({
			query: ({ userId, socialLinkId }) => ({
				url: `/users/${userId}/social-links/${socialLinkId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, _error, { userId }) => [{ type: 'Profile', id: userId }],
			async onQueryStarted({ socialLinkId }, { queryFulfilled, dispatch }) {
				try {
					await queryFulfilled;
					dispatch(removeSocialLink(socialLinkId));
				} catch {
					/* handled by baseQueryWithAuth */
				}
			},
		}),

		getFavorites: builder.query<FavoritesResponse, { userId: number; page?: number; perPage?: number }>({
			query: ({ userId, page, perPage }) => ({
				url: `/users/${userId}/favorites`,
				params: { page, per_page: perPage },
			}),
			providesTags: (_result, _error, { userId }) => [{ type: 'Favorites', id: userId }],
			keepUnusedDataFor: 60,
		}),
	}),
});

export const {
	useGetProfileQuery,
	useUpdateProfileMutation,
	useDeleteProfileMutation,
	useAddSocialLinkMutation,
	useDeleteSocialLinkMutation,
	useGetFavoritesQuery,
} = profileApi;
