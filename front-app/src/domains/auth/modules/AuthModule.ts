import { authApi, type MeResponse } from '../repositories/authRepository';
import { store } from '../../../store';
import { localStorageRepository } from '../../../repositories/localStorageRepository';
import { TOKEN_KEY } from '../../../services/httpService';

export const authModule = {
	me: async (): Promise<MeResponse> => {
		return store
			.dispatch(authApi.endpoints.me.initiate(undefined, { forceRefetch: true }))
			.unwrap();
	},

	logout: async (): Promise<void> => {
		await store.dispatch(authApi.endpoints.logout.initiate()).unwrap();
	},

	getToken: (): string | null => {
		return localStorageRepository.get(TOKEN_KEY);
	},
};
