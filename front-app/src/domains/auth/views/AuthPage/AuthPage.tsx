import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import { authModule } from '../../modules/AuthModule';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import s from './AuthPage.module.scss';

function AuthPage() {
	const navigate = useNavigate();

	useEffect(() => {
		if (authModule.getToken()) {
			navigate('/profile', { replace: true });
		}
	}, []);

	function handleSuccess() {
		navigate('/profile', { replace: true });
	}

	const tabs = [
		{ key: 'login', label: 'Вход', children: <LoginForm onSuccess={handleSuccess} /> },
		{ key: 'register', label: 'Регистрация', children: <RegisterForm onSuccess={handleSuccess} /> },
	];

	return (
		<div className={s.root}>
			<div className={s.card}>
				<div className={s.logo}>☕</div>
				<h1 className={s.title}>CoffeeMatch</h1>
				<p className={s.subtitle}>Найди своего кофейного близнеца</p>
				<Tabs defaultActiveKey="login" items={tabs} centered={true} />
			</div>
		</div>
	);
}

export default AuthPage;
