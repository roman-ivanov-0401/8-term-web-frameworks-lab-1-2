import { makeAutoObservable } from 'mobx';
import type { UploadFile } from 'antd';

class ProfileStore {
	editOpen: boolean = false;
	newLinkValue: string = '';
	fileList: UploadFile[] = [];
	avatarError: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setEditOpen(open: boolean) {
		this.editOpen = open;
	}

	setNewLinkValue(value: string) {
		this.newLinkValue = value;
	}

	setFileList(fileList: UploadFile[]) {
		this.fileList = fileList;
	}

	setAvatarError(value: boolean) {
		this.avatarError = value;
	}
}

export const profileStore = new ProfileStore();
