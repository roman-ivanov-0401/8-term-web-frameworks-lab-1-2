import { useEffect } from 'react';
import { Button, Drawer, Form, Input, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { profileModule, type UpdateProfilePayload, type UserProfile } from '../../modules/ProfileModule';
import { useProfileStore } from '../../models/profileModel';
import s from './EditProfileDrawer.module.scss';

type EditFormValues = {
	user_name: string;
	user_description: string;
};

type EditProfileDrawerProps = {
	open: boolean;
	profile: UserProfile;
};

function EditProfileDrawer({ open, profile }: EditProfileDrawerProps) {
	const fileList = useProfileStore((state) => state.fileList);
	const [form] = Form.useForm<EditFormValues>();

	useEffect(() => {
		if (open) {
			form.setFieldsValue({
				user_name: profile.user_name,
				user_description: profile.user_description,
			});
			if (profile.photo_path) {
				profileModule.setFileList([{
					uid: '-1',
					name: 'avatar',
					status: 'done',
					url: profile.photo_path,
				}]);
			} else {
				profileModule.resetFileList();
			}
		}
	}, [open, profile, form]);

	function handleFinish(values: EditFormValues) {
		const payload: UpdateProfilePayload = {
			user_name: values.user_name,
			user_description: values.user_description,
			photo: fileList[0]?.originFileObj as File | undefined,
		};
		profileModule.updateProfile(payload);
	}

	const drawerFooter = (
		<div className={s.drawerFooter}>
			<Button onClick={profileModule.closeEditDrawer}>Отмена</Button>
			<Button type="primary" onClick={() => form.submit()}>
				Сохранить
			</Button>
		</div>
	);

	return (
		<Drawer
			title="Редактировать профиль"
			open={open}
			onClose={profileModule.closeEditDrawer}
			width={480}
			footer={drawerFooter}
		>
			<Form form={form} layout="vertical" onFinish={handleFinish}>
				<Form.Item label="Фото профиля">
					<Upload
						listType="picture-circle"
						fileList={fileList}
						onChange={({ fileList: newList }) => profileModule.setFileList(newList)}
						beforeUpload={() => false}
						maxCount={1}
						accept="image/*"
					>
						{fileList.length === 0 && (
							<div className={s.uploadTrigger}>
								<PlusOutlined />
								<span>Фото</span>
							</div>
						)}
					</Upload>
				</Form.Item>

				<Form.Item
					label="Имя пользователя"
					name="user_name"
					rules={[{ required: true, message: 'Введите имя' }]}
				>
					<Input placeholder="Ваше имя" size="large" />
				</Form.Item>

				<Form.Item label="О себе" name="user_description">
					<Input.TextArea
						placeholder="Расскажите о себе..."
						rows={4}
						showCount={true}
						maxLength={300}
					/>
				</Form.Item>
			</Form>
		</Drawer>
	);
}

export default EditProfileDrawer;
