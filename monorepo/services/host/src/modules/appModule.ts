import { authModule } from '@app/shared';

export const appModule = {
	getInitialRoute: (): string => {
		return authModule.getToken() ? '/profile' : '/auth';
	},
};
