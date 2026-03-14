import { Button, Form, Input, Tabs } from 'antd';
import {
	handleLoginSubmit,
	handleRegisterSubmit,
	type LoginFormValues,
	type RegisterFormValues,
} from '../modules/AuthModule';
import s from './AuthPage.module.scss';

const emailRules = [
	{ required: true, message: 'Введите email' },
	{ type: 'email' as const, message: 'Некорректный email' },
];

const passwordRules = [
	{ required: true, message: 'Введите пароль' },
	{ min: 6, message: 'Минимум 6 символов' },
];

const LoginForm = () => {
	const [form] = Form.useForm<LoginFormValues>();

	return (
		<Form form={form} layout="vertical" onFinish={handleLoginSubmit} size="large">
			<Form.Item label="Email" name="email" rules={emailRules}>
				<Input placeholder="your@email.com" />
			</Form.Item>
			<Form.Item label="Пароль" name="password" rules={passwordRules}>
				<Input.Password placeholder="••••••" />
			</Form.Item>
			<Form.Item className={s.formLastItem}>
				<Button type="primary" htmlType="submit" block>
					Войти
				</Button>
			</Form.Item>
		</Form>
	);
};

const RegisterForm = () => {
	const [form] = Form.useForm<RegisterFormValues>();

	return (
		<Form form={form} layout="vertical" onFinish={handleRegisterSubmit} size="large">
			<Form.Item label="Email" name="email" rules={emailRules}>
				<Input placeholder="your@email.com" />
			</Form.Item>
			<Form.Item label="Пароль" name="password" rules={passwordRules}>
				<Input.Password placeholder="••••••" />
			</Form.Item>
			<Form.Item className={s.formLastItem}>
				<Button type="primary" htmlType="submit" block>
					Зарегистрироваться
				</Button>
			</Form.Item>
		</Form>
	);
};

const tabs = [
	{ key: 'login', label: 'Вход', children: <LoginForm /> },
	{ key: 'register', label: 'Регистрация', children: <RegisterForm /> },
];

const AuthPage = () => {
	return (
		<div className={s.root}>
			<div className={s.card}>
				<div className={s.logo}>☕</div>
				<h1 className={s.title}>CoffeeMatch</h1>
				<p className={s.subtitle}>Найди своего кофейного близнеца</p>
				<Tabs defaultActiveKey="login" items={tabs} centered />
			</div>
		</div>
	);
};

export default AuthPage;
