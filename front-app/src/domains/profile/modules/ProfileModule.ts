import type { UploadFile } from 'antd';
import { authApi } from '../../auth/repositories/authRepository';
import { profileApi } from '../repositories/profileRepository';
import { store } from '../../../store';
import { setCurrentUser } from '../../../models/currentUserModel';
import { setEditOpen, setNewLinkValue, setFileList } from '../models/profileModel';

export type { CurrentUser as UserProfile, CurrentUserSocialLink as SocialLink } from '../../../models/currentUserModel';

export const profileModule = {
	getMyProfile: async (): Promise<void> => {
		const me = await store
			.dispatch(authApi.endpoints.me.initiate(undefined, { forceRefetch: true }))
			.unwrap();
		const profile = await store
			.dispatch(profileApi.endpoints.getProfile.initiate(me.user_id, { forceRefetch: true }))
			.unwrap();
		store.dispatch(
			setCurrentUser({
				...profile,
				user_name: me.user_name,
				email: me.email,
			}),
		);
	},

	openEditDrawer: (): void => {
		store.dispatch(setEditOpen(true));
	},

	closeEditDrawer: (): void => {
		store.dispatch(setEditOpen(false));
	},

	setNewLinkValue: (value: string): void => {
		store.dispatch(setNewLinkValue(value));
	},

	setFileList: (fileList: UploadFile[]): void => {
		store.dispatch(setFileList(fileList));
	},

	resetFileList: (): void => {
		store.dispatch(setFileList([]));
	},
};
