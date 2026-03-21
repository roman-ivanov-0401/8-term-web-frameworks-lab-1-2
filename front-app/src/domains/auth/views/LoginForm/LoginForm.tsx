import { Button, Form, Input } from 'antd';
import { authModule, type LoginFormValues } from '../../modules/AuthModule';
import s from './LoginForm.module.scss';

const emailRules = [
	{ required: true, message: 'Введите email' },
	{ type: 'email' as const, message: 'Некорректный email' },
];

const passwordRules = [
	{ required: true, message: 'Введите пароль' },
	{ min: 6, message: 'Минимум 6 символов' },
];

type LoginFormProps = {
	onSuccess: () => void;
};

function LoginForm({ onSuccess }: LoginFormProps) {
	const [form] = Form.useForm<LoginFormValues>();

	async function handleFinish(values: LoginFormValues) {
		await authModule.login(values);
		onSuccess();
	}

	return (
		<Form form={form} layout="vertical" onFinish={handleFinish} size="large">
			<Form.Item label="Email" name="email" rules={emailRules}>
				<Input placeholder="your@email.com" />
			</Form.Item>
			<Form.Item label="Пароль" name="password" rules={passwordRules}>
				<Input.Password placeholder="••••••" />
			</Form.Item>
			<Form.Item className={s.formLastItem}>
				<Button type="primary" htmlType="submit" block={true}>
					Войти
				</Button>
			</Form.Item>
		</Form>
	);
}

export default LoginForm;
