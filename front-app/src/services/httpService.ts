import axios, { AxiosError } from 'axios';
import { localStorageRepository } from '../repositories/localStorageRepository';
import { errorService } from './errorService';

const TOKEN_KEY = 'auth_token';
const AUTH_SKIP_URLS = ['/auth/login', '/auth/register'];

export const axiosInstance = axios.create({
	baseURL: '/api/v1',
	headers: {
		'Content-Type': 'application/json',
	},
	paramsSerializer: {
		indexes: null,
	},
});

axiosInstance.interceptors.request.use((config) => {
	const url = config.url ?? '';
	const isSkipped = AUTH_SKIP_URLS.some((skip) => url.includes(skip));

	if (!isSkipped) {
		const token = localStorageRepository.get(TOKEN_KEY);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}

	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		const status = error.response?.status;

		if (status && status >= 400) {
			errorService.handleAxiosError(error);
		}

		return Promise.reject(error);
	},
);
