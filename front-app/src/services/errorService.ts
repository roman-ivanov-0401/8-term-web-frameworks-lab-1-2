import { notification } from 'antd';

type ApiErrorData = {
	error?: {
		code?: string;
		message?: string;
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
	handleError: (status: number, data?: unknown): void => {
		if (status < 400) return;

		const apiData = data as ApiErrorData | undefined;
		const apiMessage = apiData?.error?.message;
		const fallbackMessage = ERROR_MESSAGES[status] ?? 'Произошла ошибка';

		notification.error({
			message: `Ошибка ${status}`,
			description: apiMessage ?? fallbackMessage,
			placement: 'topRight',
		});
	},
};
