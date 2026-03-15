import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Grid, Menu } from 'antd';
import {
	BookOutlined,
	LogoutOutlined,
	MenuOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { authModule } from '../domains/auth/modules/AuthModule';
import s from './AppNavbar.module.scss';

const { useBreakpoint } = Grid;

const mobileItems = [
	{ key: '/catalog', label: 'Каталог', icon: <BookOutlined /> },
	{ key: '/matches', label: 'Найти метч', icon: <TeamOutlined /> },
	{ key: '/profile', label: 'Профиль', icon: <UserOutlined /> },
	{ key: 'logout', label: 'Выйти', icon: <LogoutOutlined />, danger: true },
];

type NavButtonProps = {
	icon: React.ReactNode;
	label: string;
	active: boolean;
	danger?: boolean;
	onClick: () => void;
};

function NavButton({ icon, label, active, danger = false, onClick }: NavButtonProps) {
	return (
		<Button
			type="text"
			icon={icon}
			onClick={onClick}
			className={[s.navBtn, active ? s.navBtnActive : '', danger ? s.navBtnDanger : '']
				.filter(Boolean)
				.join(' ')}
		>
			{label}
		</Button>
	);
}

function AppNavbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const screens = useBreakpoint();
	const [drawerOpen, setDrawerOpen] = useState(false);

	if (!authModule.getToken()) return null;

	const isMobile = !screens.md;
	const path = location.pathname;

	async function handleNav(key: string) {
		setDrawerOpen(false);
		if (key === 'logout') {
			await authModule.logout();
			navigate('/auth', { replace: true });
			return;
		}
		navigate(key);
	}

	if (isMobile) {
		return (
			<>
				<header className={s.mobileHeader}>
					<span className={s.logo}>☕ CoffeeMatch</span>
					<Button
						type="text"
						icon={<MenuOutlined className={s.burgerIcon} />}
						onClick={() => setDrawerOpen(true)}
						className={s.burgerBtn}
					/>
				</header>

				<Drawer
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					placement="right"
					width={240}
					title="Меню"
					styles={{ body: { padding: '8px 0', background: '#faf6f1' } }}
				>
					<Menu
						mode="inline"
						selectedKeys={[path]}
						items={mobileItems}
						onClick={({ key }) => handleNav(key)}
						style={{ border: 'none', background: 'transparent' }}
					/>
				</Drawer>
			</>
		);
	}

	return (
		<header className={s.header}>
			<div className={s.inner}>
				<div className={s.left}>
					<span className={s.logo}>☕ CoffeeMatch</span>
					<NavButton
						icon={<BookOutlined />}
						label="Каталог"
						active={path === '/catalog'}
						onClick={() => handleNav('/catalog')}
					/>
					<NavButton
						icon={<TeamOutlined />}
						label="Найти метч"
						active={path === '/matches'}
						onClick={() => handleNav('/matches')}
					/>
				</div>

				<div className={s.right}>
					<NavButton
						icon={<UserOutlined />}
						label="Профиль"
						active={path === '/profile'}
						onClick={() => handleNav('/profile')}
					/>
					<NavButton
						icon={<LogoutOutlined />}
						label="Выйти"
						active={false}
						danger={true}
						onClick={() => handleNav('logout')}
					/>
				</div>
			</div>
		</header>
	);
}

export default AppNavbar;
