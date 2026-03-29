import { Button, Form, Input } from 'antd';
import { useRegisterMutation, type RegisterPayload } from '../../repositories/authRepository';
import s from './RegisterForm.module.scss';

const emailRules = [
	{ required: true, message: 'Введите email' },
	{ type: 'email' as const, message: 'Некорректный email' },
];

const passwordRules = [
	{ required: true, message: 'Введите пароль' },
	{ min: 6, message: 'Минимум 6 символов' },
];

type RegisterFormProps = {
	onSuccess: () => void;
};

function RegisterForm({ onSuccess }: RegisterFormProps) {
	const [form] = Form.useForm<RegisterPayload>();
	const [register, { isLoading }] = useRegisterMutation();

	async function handleFinish(values: RegisterPayload) {
		await register(values).unwrap();
		onSuccess();
	}

	return (
		<Form form={form} layout="vertical" onFinish={handleFinish} size="large">
			<Form.Item
				label="Имя пользователя"
				name="user_name"
				rules={[{ required: true, message: 'Введите имя пользователя' }]}
			>
				<Input placeholder="username" />
			</Form.Item>
			<Form.Item label="Email" name="email" rules={emailRules}>
				<Input placeholder="your@email.com" />
			</Form.Item>
			<Form.Item label="Пароль" name="password" rules={passwordRules}>
				<Input.Password placeholder="••••••" />
			</Form.Item>
			<Form.Item className={s.formLastItem}>
				<Button type="primary" htmlType="submit" loading={isLoading} block={true}>
					Зарегистрироваться
				</Button>
			</Form.Item>
		</Form>
	);
}

export default RegisterForm;
