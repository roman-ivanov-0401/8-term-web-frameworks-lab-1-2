import { axiosInstance } from '../../../services/httpService';

type AuthUser = {
	user_id: number;
	user_name: string;
	email: string;
};

type AuthResponse = {
	token: string;
	user: AuthUser;
};

type SocialLink = {
	social_link_id: number;
	link: string;
};

type MeResponse = {
	user_id: number;
	user_name: string;
	email: string;
	user_profile_id: number;
	user_description: string;
	photo_path: string | null;
	social_links: SocialLink[];
};

type RegisterPayload = {
	user_name: string;
	email: string;
	password: string;
};

type LoginPayload = {
	email: string;
	password: string;
};

export const authRepository = {
	register: async (payload: RegisterPayload): Promise<AuthResponse> => {
		const { data } = await axiosInstance.post<AuthResponse>('/auth/register', payload);
		return data;
	},

	login: async (payload: LoginPayload): Promise<AuthResponse> => {
		const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload);
		return data;
	},

	me: async (): Promise<MeResponse> => {
		const { data } = await axiosInstance.get<MeResponse>('/auth/me');
		return data;
	},

	logout: async (): Promise<void> => {
		await axiosInstance.post('/auth/logout');
	},
};
