import { useEffect, useState } from 'react';
import { Button, Input, Popconfirm, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, LinkOutlined, PlusOutlined } from '@ant-design/icons';
import { profileModule, type AddSocialLinkPayload } from '../../modules/ProfileModule';
import { useCurrentUserStore } from '../../../../models/currentUserModel';
import { useProfileStore } from '../../models/profileModel';
import EditProfileDrawer from '../EditProfileDrawer/EditProfileDrawer';
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

function ProfilePage() {
	const profile = useCurrentUserStore((state) => state.currentUser);
	const editOpen = useProfileStore((state) => state.editOpen);
	const newLinkValue = useProfileStore((state) => state.newLinkValue);
	const [avatarError, setAvatarError] = useState(false);

	useEffect(() => {
		profileModule.getMyProfile();
	}, []);

	useEffect(() => {
		setAvatarError(false);
	}, [profile?.photo_path]);

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
				<div className={s.profileCard}>
					<div className={s.avatarWrap}>
						{profile.photo_path && !avatarError ? (
							<img
								src={profile.photo_path}
								alt={profile.user_name}
								className={s.avatarImg}
								onError={() => setAvatarError(true)}
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
}

export default ProfilePage;
