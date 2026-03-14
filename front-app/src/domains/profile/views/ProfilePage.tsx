import { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, Popconfirm, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import {
	addSocialLink,
	deleteProfile,
	deleteSocialLink,
	updateProfile,
	type AddSocialLinkPayload,
	type UpdateProfilePayload,
} from '../modules/ProfileModule';
import s from './ProfilePage.module.scss';

// ─── Types (mirror of GET /users/:user_id response) ──────────────────────────

type SocialLink = {
	social_link_id: number;
	link: string;
	created_at: string;
	modified_at: string;
};

type UserProfile = {
	user_profile_id: number;
	user_id: number;
	user_name: string;
	user_description: string;
	photo_path: string | null;
	social_links: SocialLink[];
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PROFILE: UserProfile = {
	user_profile_id: 1,
	user_id: 42,
	user_name: 'Роман Иванов',
	user_description: 'Кофеман со стажем. Обожаю эспрессо по утрам и специалти-кофейни. Ищу людей с похожим вкусом.',
	photo_path: null,
	social_links: [
		{
			social_link_id: 1,
			link: 'https://t.me/roman_coffee',
			created_at: '',
			modified_at: '',
		},
		{
			social_link_id: 2,
			link: 'https://instagram.com/roman_i',
			created_at: '',
			modified_at: '',
		},
	],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Edit profile drawer ──────────────────────────────────────────────────────

type EditFormValues = {
	user_name: string;
	user_description: string;
};

type EditProfileDrawerProps = {
	open: boolean;
	profile: UserProfile;
	onClose: () => void;
	onSave: (payload: UpdateProfilePayload) => void;
};

function EditProfileDrawer({ open, profile, onClose, onSave }: EditProfileDrawerProps) {
	const [form] = Form.useForm<EditFormValues>();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	useEffect(() => {
		if (open) {
			form.setFieldsValue({
				user_name: profile.user_name,
				user_description: profile.user_description,
			});
			setFileList([]);
		}
	}, [open, profile, form]);

	function handleFinish(values: EditFormValues) {
		const payload: UpdateProfilePayload = {
			user_name: values.user_name,
			user_description: values.user_description,
			photo: fileList[0]?.originFileObj as File | undefined,
		};
		onSave(payload);
	}

	const drawerFooter = (
		<div className={s.drawerFooter}>
			<Button onClick={onClose}>Отмена</Button>
			<Button type="primary" onClick={() => form.submit()}>
				Сохранить
			</Button>
		</div>
	);

	return (
		<Drawer
			title="Редактировать профиль"
			open={open}
			onClose={onClose}
			width={480}
			footer={drawerFooter}
		>
			<Form form={form} layout="vertical" onFinish={handleFinish}>
				<Form.Item label="Фото профиля">
					<Upload
						listType="picture-circle"
						fileList={fileList}
						onChange={({ fileList: newList }) => setFileList(newList)}
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProfilePage = () => {
	const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE);
	const [editOpen, setEditOpen] = useState(false);
	const [newLinkValue, setNewLinkValue] = useState('');

	function handleSaveProfile(payload: UpdateProfilePayload) {
		updateProfile(payload);
		setProfile((p) => ({
			...p,
			user_name: payload.user_name,
			user_description: payload.user_description,
		}));
		setEditOpen(false);
	}

	function handleAddLink() {
		const link = newLinkValue.trim();
		if (!link) return;

		const payload: AddSocialLinkPayload = { link };
		addSocialLink(profile.user_id, payload);

		const newEntry: SocialLink = {
			social_link_id: Date.now(),
			link,
			created_at: new Date().toISOString(),
			modified_at: new Date().toISOString(),
		};
		setProfile((p) => ({ ...p, social_links: [...p.social_links, newEntry] }));
		setNewLinkValue('');
	}

	function handleDeleteLink(socialLinkId: number) {
		deleteSocialLink(profile.user_id, socialLinkId);
		setProfile((p) => ({
			...p,
			social_links: p.social_links.filter((l) => l.social_link_id !== socialLinkId),
		}));
	}

	function handleDeleteProfile() {
		deleteProfile();
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
						onClick={() => setEditOpen(true)}
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
							onChange={(e) => setNewLinkValue(e.target.value)}
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

			<EditProfileDrawer
				open={editOpen}
				profile={profile}
				onClose={() => setEditOpen(false)}
				onSave={handleSaveProfile}
			/>
		</div>
	);
};

export default ProfilePage;
