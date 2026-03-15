import { authModule } from '../domains/auth/modules/AuthModule';

export const appModule = {
	getInitialRoute: (): string => {
		return authModule.getToken() ? '/profile' : '/auth';
	},
};
