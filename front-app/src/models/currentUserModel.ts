import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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

type CurrentUserState = {
	currentUser: CurrentUser | null;
};

const initialState: CurrentUserState = {
	currentUser: null,
};

export const currentUserSlice = createSlice({
	name: 'currentUser',
	initialState,
	reducers: {
		setCurrentUser: (state, action: PayloadAction<CurrentUser | null>) => {
			state.currentUser = action.payload;
		},
		updateCurrentUser: (state, action: PayloadAction<Partial<CurrentUser>>) => {
			if (state.currentUser) {
				state.currentUser = { ...state.currentUser, ...action.payload };
			}
		},
		addSocialLink: (state, action: PayloadAction<CurrentUserSocialLink>) => {
			state.currentUser?.social_links.push(action.payload);
		},
		removeSocialLink: (state, action: PayloadAction<number>) => {
			if (state.currentUser) {
				state.currentUser.social_links = state.currentUser.social_links.filter(
					(l: CurrentUserSocialLink) => l.social_link_id !== action.payload,
				);
			}
		},
	},
});

export const { setCurrentUser, updateCurrentUser, addSocialLink, removeSocialLink } = currentUserSlice.actions;
export default currentUserSlice.reducer;
