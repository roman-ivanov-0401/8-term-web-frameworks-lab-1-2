import { localStorageRepository } from '../../../repositories/localStorageRepository';
import { authRepository } from '../repositories/authRepository';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export type LoginFormValues = {
	email: string;
	password: string;
};

export type RegisterFormValues = {
	user_name: string;
	email: string;
	password: string;
};

export const authModule = {
	login: async (values: LoginFormValues): Promise<void> => {
		const { token, refresh_token } = await authRepository.login(values);
		localStorageRepository.set(TOKEN_KEY, token);
		localStorageRepository.set(REFRESH_TOKEN_KEY, refresh_token);
	},

	register: async (values: RegisterFormValues): Promise<void> => {
		const { token, refresh_token } = await authRepository.register(values);
		localStorageRepository.set(TOKEN_KEY, token);
		localStorageRepository.set(REFRESH_TOKEN_KEY, refresh_token);
	},

	me: authRepository.me,

	logout: async (): Promise<void> => {
		await authRepository.logout();
		localStorageRepository.remove(TOKEN_KEY);
		localStorageRepository.remove(REFRESH_TOKEN_KEY);
	},

	getToken: (): string | null => {
		return localStorageRepository.get(TOKEN_KEY);
	},
};
