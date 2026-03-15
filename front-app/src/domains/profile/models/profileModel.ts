import { create } from 'zustand';
import type { UploadFile } from 'antd';

type ProfileStore = {
	editOpen: boolean;
	newLinkValue: string;
	fileList: UploadFile[];
	setEditOpen: (open: boolean) => void;
	setNewLinkValue: (value: string) => void;
	setFileList: (fileList: UploadFile[]) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
	editOpen: false,
	newLinkValue: '',
	fileList: [],
	setEditOpen: (open) => set({ editOpen: open }),
	setNewLinkValue: (value) => set({ newLinkValue: value }),
	setFileList: (fileList) => set({ fileList }),
}));
