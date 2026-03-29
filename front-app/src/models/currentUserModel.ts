import { makeAutoObservable } from 'mobx';

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

class CurrentUserStore {
	currentUser: CurrentUser | null = null;

	constructor() {
		makeAutoObservable(this);
	}

	setCurrentUser(user: CurrentUser | null) {
		this.currentUser = user;
	}

	updateCurrentUser(updates: Partial<CurrentUser>) {
		if (this.currentUser) {
			this.currentUser = { ...this.currentUser, ...updates };
		}
	}

	addSocialLink(link: CurrentUserSocialLink) {
		if (this.currentUser) {
			this.currentUser.social_links = [...this.currentUser.social_links, link];
		}
	}

	removeSocialLink(socialLinkId: number) {
		if (this.currentUser) {
			this.currentUser.social_links = this.currentUser.social_links.filter(
				(l) => l.social_link_id !== socialLinkId,
			);
		}
	}
}

export const currentUserStore = new CurrentUserStore();
