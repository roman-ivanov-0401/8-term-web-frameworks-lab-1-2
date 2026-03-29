import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UploadFile } from 'antd';

type ProfileState = {
	editOpen: boolean;
	newLinkValue: string;
	fileList: UploadFile[];
};

const initialState: ProfileState = {
	editOpen: false,
	newLinkValue: '',
	fileList: [],
};

export const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		setEditOpen: (state, action: PayloadAction<boolean>) => {
			state.editOpen = action.payload;
		},
		setNewLinkValue: (state, action: PayloadAction<string>) => {
			state.newLinkValue = action.payload;
		},
		setFileList: (state, action: PayloadAction<UploadFile[]>) => {
			state.fileList = action.payload;
		},
	},
});

export const { setEditOpen, setNewLinkValue, setFileList } = profileSlice.actions;
export default profileSlice.reducer;
