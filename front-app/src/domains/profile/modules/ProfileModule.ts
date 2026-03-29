import type { UploadFile } from 'antd';
import { authModule } from '../../auth/modules/AuthModule';
import { profileRepository } from '../repositories/profileRepository';
import { currentUserStore } from '../../../models/currentUserModel';
import { profileStore } from '../models/profileModel';

export type { CurrentUser as UserProfile, CurrentUserSocialLink as SocialLink } from '../../../models/currentUserModel';

export type UpdateProfilePayload = {
	user_name: string;
	user_description: string;
	photo?: File;
};

export type AddSocialLinkPayload = {
	link: string;
};

export const profileModule = {
	getMyProfile: async (): Promise<void> => {
		const me = await authModule.me();
		const profile = await profileRepository.getProfile(me.user_id);
		currentUserStore.setCurrentUser({
			...profile,
			user_name: me.user_name,
			email: me.email,
		});

		console.log({ ...profile, email: me.email });
	},

	updateProfile: async (payload: UpdateProfilePayload): Promise<void> => {
		const { photo_path } = await profileRepository.updateProfile(payload);
		currentUserStore.updateCurrentUser({
			user_name: payload.user_name,
			user_description: payload.user_description,
			photo_path,
		});
		profileStore.setEditOpen(false);
	},

	deleteProfile: async (): Promise<void> => {
		await profileRepository.deleteProfile();
		currentUserStore.setCurrentUser(null);
	},

	addSocialLink: async (userId: number, payload: AddSocialLinkPayload): Promise<void> => {
		const { social_link_id, link } = await profileRepository.addSocialLink(userId, payload);
		currentUserStore.addSocialLink({ social_link_id, link, created_at: '', modified_at: '' });
		profileStore.setNewLinkValue('');
	},

	deleteSocialLink: async (userId: number, socialLinkId: number): Promise<void> => {
		await profileRepository.deleteSocialLink(userId, socialLinkId);
		currentUserStore.removeSocialLink(socialLinkId);
	},

	openEditDrawer: (): void => {
		profileStore.setEditOpen(true);
	},

	closeEditDrawer: (): void => {
		profileStore.setEditOpen(false);
	},

	setNewLinkValue: (value: string): void => {
		profileStore.setNewLinkValue(value);
	},

	setFileList: (fileList: UploadFile[]): void => {
		profileStore.setFileList(fileList);
	},

	resetFileList: (): void => {
		profileStore.setFileList([]);
	},
};
