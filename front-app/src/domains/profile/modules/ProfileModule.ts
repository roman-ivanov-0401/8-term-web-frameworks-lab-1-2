import type { UploadFile } from 'antd';
import { authModule } from '../../auth/modules/AuthModule';
import { profileRepository } from '../repositories/profileRepository';
import { useCurrentUserStore } from '../../../models/currentUserModel';
import { useProfileStore } from '../models/profileModel';

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
		useCurrentUserStore.getState().setCurrentUser({
			...profile,
			user_name: me.user_name,
			email: me.email,
		});

		console.log({ ...profile, email: me.email });
	},

	updateProfile: async (payload: UpdateProfilePayload): Promise<void> => {
		const { photo_path } = await profileRepository.updateProfile(payload);
		useCurrentUserStore.getState().updateCurrentUser({
			user_name: payload.user_name,
			user_description: payload.user_description,
			photo_path,
		});
		useProfileStore.getState().setEditOpen(false);
	},

	deleteProfile: async (): Promise<void> => {
		await profileRepository.deleteProfile();
		useCurrentUserStore.getState().setCurrentUser(null);
	},

	addSocialLink: async (userId: number, payload: AddSocialLinkPayload): Promise<void> => {
		const { social_link_id, link } = await profileRepository.addSocialLink(userId, payload);
		useCurrentUserStore.getState().addSocialLink({ social_link_id, link, created_at: '', modified_at: '' });
		useProfileStore.getState().setNewLinkValue('');
	},

	deleteSocialLink: async (userId: number, socialLinkId: number): Promise<void> => {
		await profileRepository.deleteSocialLink(userId, socialLinkId);
		useCurrentUserStore.getState().removeSocialLink(socialLinkId);
	},

	openEditDrawer: (): void => {
		useProfileStore.getState().setEditOpen(true);
	},

	closeEditDrawer: (): void => {
		useProfileStore.getState().setEditOpen(false);
	},

	setNewLinkValue: (value: string): void => {
		useProfileStore.getState().setNewLinkValue(value);
	},

	setFileList: (fileList: UploadFile[]): void => {
		useProfileStore.getState().setFileList(fileList);
	},

	resetFileList: (): void => {
		useProfileStore.getState().setFileList([]);
	},
};
