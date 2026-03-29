import { Button, Form, Input } from 'antd';
import { useLoginMutation, type LoginPayload } from '../../repositories/authRepository';
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
	const [form] = Form.useForm<LoginPayload>();
	const [login, { isLoading }] = useLoginMutation();

	async function handleFinish(values: LoginPayload) {
		await login(values).unwrap();
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
				<Button type="primary" htmlType="submit" loading={isLoading} block={true}>
					Войти
				</Button>
			</Form.Item>
		</Form>
	);
}

export default LoginForm;
