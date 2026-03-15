import { notification } from 'antd';
import { AxiosError } from 'axios';

type ApiError = {
	error: {
		code: string;
		message: string;
	};
};

const ERROR_MESSAGES: Record<number, string> = {
	400: 'Некорректный запрос',
	401: 'Необходима авторизация',
	403: 'Доступ запрещён',
	404: 'Ресурс не найден',
	409: 'Конфликт данных',
	500: 'Внутренняя ошибка сервера',
};

export const errorService = {
	handleAxiosError: (error: AxiosError<ApiError>): void => {
		const status = error.response?.status;

		if (!status || status < 400) return;

		const apiMessage = error.response?.data?.error?.message;
		const fallbackMessage = ERROR_MESSAGES[status] ?? 'Произошла ошибка';

		notification.error({
			message: `Ошибка ${status}`,
			description: apiMessage ?? fallbackMessage,
			placement: 'topRight',
		});
	},
};
