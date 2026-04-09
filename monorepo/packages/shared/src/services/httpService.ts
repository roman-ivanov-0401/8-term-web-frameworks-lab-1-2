import axios, { AxiosError } from 'axios';
import { localStorageRepository } from '../repositories/localStorageRepository';
import { errorService } from './errorService';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const AUTH_SKIP_URLS = ['/auth/login', '/auth/register', '/auth/refresh'];

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

const MAX_REFRESH_RETRIES = 3;

let refreshPromise: Promise<string> | null = null;

async function fetchNewToken(refreshToken: string): Promise<string> {
	let lastError: unknown;

	for (let attempt = 0; attempt < MAX_REFRESH_RETRIES; attempt++) {
		try {
			const { data } = await axiosInstance.post<{ token: string; refresh_token: string }>('/auth/refresh', {
				refresh_token: refreshToken,
			});
			localStorageRepository.set(TOKEN_KEY, data.token);
			localStorageRepository.set(REFRESH_TOKEN_KEY, data.refresh_token);
			return data.token;
		} catch (e) {
			lastError = e;
		}
	}

	throw lastError;
}

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as any;
		const status = error.response?.status;

		if (
			status === 401 &&
			!originalRequest._retry &&
			!AUTH_SKIP_URLS.some((skip) => (originalRequest.url ?? '').includes(skip))
		) {
			originalRequest._retry = true;

			const refreshToken = localStorageRepository.get(REFRESH_TOKEN_KEY);
			if (!refreshToken) {
				localStorageRepository.remove(TOKEN_KEY);
				localStorageRepository.remove(REFRESH_TOKEN_KEY);
				return Promise.reject(error);
			}

			try {
				if (!refreshPromise) {
					refreshPromise = fetchNewToken(refreshToken).finally(() => {
						refreshPromise = null;
					});
				}

				const newToken = await refreshPromise;
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return axiosInstance(originalRequest);
			} catch {
				localStorageRepository.remove(TOKEN_KEY);
				localStorageRepository.remove(REFRESH_TOKEN_KEY);
				return Promise.reject(error);
			}
		}

		if (status && status >= 400) {
			errorService.handleAxiosError(error);
		}

		return Promise.reject(error);
	},
);
