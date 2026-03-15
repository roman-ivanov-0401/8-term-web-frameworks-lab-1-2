import { useEffect } from 'react';
import { Button, Drawer, Form, Input, Popconfirm, Spin, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons';
import {
	profileModule,
	type AddSocialLinkPayload,
	type UpdateProfilePayload,
	type UserProfile,
} from '../modules/ProfileModule';
import { useCurrentUserStore } from '../../../models/currentUserModel';
import { useProfileStore } from '../models/profileModel';
import s from './ProfilePage.module.scss';

function getInitials(name: string): string {
	return name
		.split(' ')
		.map((w) => w[0] ?? '')
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

function linkLabel(url: string): string {
	try {
		return new URL(url).hostname.replace('www.', '');
	} catch {
		return url;
	}
}

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
			profileModule.resetFileList();
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

const ProfilePage = () => {
	const profile = useCurrentUserStore((state) => state.currentUser);
	const editOpen = useProfileStore((state) => state.editOpen);
	const newLinkValue = useProfileStore((state) => state.newLinkValue);

	useEffect(() => {
		profileModule.getMyProfile();
	}, []);

	async function handleAddLink() {
		if (!profile) return;
		const link = newLinkValue.trim();
		if (!link) return;

		const payload: AddSocialLinkPayload = { link };
		await profileModule.addSocialLink(profile.user_id, payload);
	}

	async function handleDeleteLink(socialLinkId: number) {
		if (!profile) return;
		await profileModule.deleteSocialLink(profile.user_id, socialLinkId);
	}

	async function handleDeleteProfile() {
		await profileModule.deleteProfile();
	}

	if (!profile) {
		return (
			<div className={s.page}>
				<Spin size="large" />
			</div>
		);
	}

	const initials = getInitials(profile.user_name);

	return (
		<div className={s.page}>
			<div className={s.content}>

				{/* ── Profile card ── */}
				<div className={s.profileCard}>
					<div className={s.avatarWrap}>
						{profile.photo_path ? (
							<img
								src={profile.photo_path}
								alt={profile.user_name}
								className={s.avatarImg}
							/>
						) : (
							<div className={s.avatarPlaceholder}>{initials}</div>
						)}
					</div>

					<h1 className={s.userName}>{profile.user_name}</h1>

					<p className={s.userDescription}>
						{profile.user_description || (
							<span className={s.emptyText}>Описание не добавлено</span>
						)}
					</p>

					<Button
						icon={<EditOutlined />}
						size="large"
						onClick={profileModule.openEditDrawer}
						className={s.editBtn}
					>
						Редактировать профиль
					</Button>
				</div>

				{/* ── Social links ── */}
				<section className={s.section}>
					<h2 className={s.sectionTitle}>Социальные сети</h2>

					{profile.social_links.length > 0 ? (
						<ul className={s.linksList}>
							{profile.social_links.map((sl) => (
								<li key={sl.social_link_id} className={s.linkItem}>
									<LinkOutlined className={s.linkIcon} />
									<a
										href={sl.link}
										target="_blank"
										rel="noopener noreferrer"
										className={s.linkHref}
									>
										{linkLabel(sl.link)}
									</a>
									<Button
										type="text"
										size="small"
										danger={true}
										icon={<DeleteOutlined />}
										onClick={() => handleDeleteLink(sl.social_link_id)}
										className={s.linkDeleteBtn}
									/>
								</li>
							))}
						</ul>
					) : (
						<p className={s.emptyText}>Ссылки не добавлены</p>
					)}

					<div className={s.addLinkRow}>
						<Input
							placeholder="https://..."
							value={newLinkValue}
							onChange={(e) => profileModule.setNewLinkValue(e.target.value)}
							onPressEnter={handleAddLink}
							prefix={<LinkOutlined />}
							allowClear={true}
							size="large"
							className={s.addLinkInput}
						/>
						<Button
							type="primary"
							size="large"
							icon={<PlusOutlined />}
							onClick={handleAddLink}
						>
							Добавить
						</Button>
					</div>
				</section>

				{/* ── Danger zone ── */}
				<section className={s.dangerSection}>
					<h2 className={s.dangerTitle}>Опасная зона</h2>
					<p className={s.dangerText}>
						Удаление профиля необратимо — все данные и оценки будут потеряны.
					</p>
					<Popconfirm
						title="Удалить профиль?"
						description="Это действие нельзя отменить."
						onConfirm={handleDeleteProfile}
						okText="Удалить"
						cancelText="Отмена"
						okButtonProps={{ danger: true }}
					>
						<Button danger={true} size="large" icon={<DeleteOutlined />}>
							Удалить профиль
						</Button>
					</Popconfirm>
				</section>
			</div>

			<EditProfileDrawer open={editOpen} profile={profile} />
		</div>
	);
};

export default ProfilePage;
