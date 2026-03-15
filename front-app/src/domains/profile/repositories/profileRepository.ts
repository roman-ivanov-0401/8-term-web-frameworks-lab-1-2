import { axiosInstance } from '../../../services/httpService';

type SocialLink = {
	social_link_id: number;
	link: string;
	created_at: string;
	modified_at: string;
};

type UserProfile = {
	user_profile_id: number;
	user_id: number;
	user_description: string;
	photo_path: string | null;
	social_links: SocialLink[];
};

type UpdateProfilePayload = {
	user_name: string;
	user_description: string;
	photo?: Blob;
};

type UpdateProfileResponse = {
	user_profile_id: number;
	user_description: string;
	photo_path: string | null;
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

type FavoritesResponse = {
	items: FavoriteDrink[];
	total: number;
	page: number;
};

type FavoritesParams = {
	page?: number;
	per_page?: number;
};

type AddSocialLinkPayload = {
	link: string;
};

type AddSocialLinkResponse = {
	social_link_id: number;
	link: string;
};

export const profileRepository = {
	getProfile: async (userId: number): Promise<UserProfile> => {
		const { data } = await axiosInstance.get<UserProfile>(`/users/${userId}`);
		return data;
	},

	updateProfile: async (payload: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
		const formData = new FormData();
		formData.append('user_name', payload.user_name);
		formData.append('user_description', payload.user_description);
		if (payload.photo) {
			formData.append('photo', payload.photo);
		}

		const { data } = await axiosInstance.put<UpdateProfileResponse>('/users/me', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return data;
	},

	deleteProfile: async (): Promise<void> => {
		await axiosInstance.delete('/users/me');
	},

	addSocialLink: async (userId: number, payload: AddSocialLinkPayload): Promise<AddSocialLinkResponse> => {
		const { data } = await axiosInstance.post<AddSocialLinkResponse>(`/users/${userId}/social-links`, payload);
		return data;
	},

	deleteSocialLink: async (userId: number, socialLinkId: number): Promise<void> => {
		await axiosInstance.delete(`/users/${userId}/social-links/${socialLinkId}`);
	},

	getFavorites: async (userId: number, params?: FavoritesParams): Promise<FavoritesResponse> => {
		const { data } = await axiosInstance.get<FavoritesResponse>(`/users/${userId}/favorites`, { params });
		return data;
	},
};
