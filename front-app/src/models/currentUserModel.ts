import { create } from 'zustand';

export type CurrentUserSocialLink = {
	social_link_id: number;
	link: string;
	created_at: string;
	modified_at: string;
};

export type CurrentUser = {
	user_profile_id: number;
	user_id: number;
	user_name: string;
	email: string;
	user_description: string;
	photo_path: string | null;
	social_links: CurrentUserSocialLink[];
};

type CurrentUserStore = {
	currentUser: CurrentUser | null;
	setCurrentUser: (user: CurrentUser | null) => void;
	updateCurrentUser: (updates: Partial<CurrentUser>) => void;
	addSocialLink: (link: CurrentUserSocialLink) => void;
	removeSocialLink: (socialLinkId: number) => void;
};

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
	currentUser: null,

	setCurrentUser: (user) => set({ currentUser: user }),

	updateCurrentUser: (updates) =>
		set((state) => ({
			currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
		})),

	addSocialLink: (link) =>
		set((state) => ({
			currentUser: state.currentUser
				? { ...state.currentUser, social_links: [...state.currentUser.social_links, link] }
				: null,
		})),

	removeSocialLink: (socialLinkId) =>
		set((state) => ({
			currentUser: state.currentUser
				? {
						...state.currentUser,
						social_links: state.currentUser.social_links.filter(
							(l) => l.social_link_id !== socialLinkId,
						),
					}
				: null,
		})),
}));
