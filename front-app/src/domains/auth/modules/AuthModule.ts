import { localStorageRepository } from '../../../repositories/localStorageRepository';
import { authRepository } from '../repositories/authRepository';

const TOKEN_KEY = 'auth_token';

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
		const { token } = await authRepository.login(values);
		localStorageRepository.set(TOKEN_KEY, token);
	},

	register: async (values: RegisterFormValues): Promise<void> => {
		const { token } = await authRepository.register(values);
		localStorageRepository.set(TOKEN_KEY, token);
	},

	me: authRepository.me,

	logout: async (): Promise<void> => {
		await authRepository.logout();
		localStorageRepository.remove(TOKEN_KEY);
	},

	getToken: (): string | null => {
		return localStorageRepository.get(TOKEN_KEY);
	},
};
