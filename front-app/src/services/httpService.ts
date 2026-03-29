import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { localStorageRepository } from '../repositories/localStorageRepository';
import { errorService } from './errorService';

const BASE_URL = '/api/v1';
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

const AUTH_SKIP_ENDPOINTS = ['login', 'register'];
const AUTH_SKIP_URLS = ['/auth/login', '/auth/register', '/auth/refresh'];

const MAX_REFRESH_RETRIES = 3;
let refreshPromise: Promise<void> | null = null;

async function doRefresh(): Promise<void> {
	const storedRefreshToken = localStorageRepository.get(REFRESH_TOKEN_KEY);
	if (!storedRefreshToken) throw new Error('No refresh token');

	let lastError: unknown;
	for (let attempt = 0; attempt < MAX_REFRESH_RETRIES; attempt++) {
		try {
			const response = await fetch(`${BASE_URL}/auth/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refresh_token: storedRefreshToken }),
			});
			if (!response.ok) throw new Error('Refresh failed');
			const data = (await response.json()) as { token: string; refresh_token: string };
			localStorageRepository.set(TOKEN_KEY, data.token);
			localStorageRepository.set(REFRESH_TOKEN_KEY, data.refresh_token);
			return;
		} catch (e) {
			lastError = e;
		}
	}
	throw lastError;
}

function scheduleRefresh(): Promise<void> {
	if (!refreshPromise) {
		refreshPromise = doRefresh().finally(() => {
			refreshPromise = null;
		});
	}
	return refreshPromise;
}

// RTK Query base query

function serializeParams(params: Record<string, unknown>): string {
	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			value.forEach((v) => searchParams.append(key, String(v)));
		} else {
			searchParams.set(key, String(value));
		}
	}
	return searchParams.toString();
}

const rawBaseQuery = fetchBaseQuery({
	baseUrl: BASE_URL,
	paramsSerializer: serializeParams,
	prepareHeaders: (headers, { endpoint }) => {
		if (!AUTH_SKIP_ENDPOINTS.includes(endpoint)) {
			const token = localStorageRepository.get(TOKEN_KEY);
			if (token) headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

export const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
	args,
	api,
	extraOptions,
) => {
	let result = await rawBaseQuery(args, api, extraOptions);

	if (result.error?.status === 401) {
		const hasRefreshToken = !!localStorageRepository.get(REFRESH_TOKEN_KEY);
		if (hasRefreshToken) {
			try {
				await scheduleRefresh();
				result = await rawBaseQuery(args, api, extraOptions);
			} catch {
				localStorageRepository.remove(TOKEN_KEY);
				localStorageRepository.remove(REFRESH_TOKEN_KEY);
			}
		} else {
			localStorageRepository.remove(TOKEN_KEY);
		}
	}

	if (result.error && typeof result.error.status === 'number' && result.error.status >= 400) {
		errorService.handleError(result.error.status, result.error.data);
	}

	return result;
};

// Fetch-based HTTP utility for non-RTK repositories

type RequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	params?: Record<string, unknown>;
};

function buildUrl(path: string, params?: Record<string, unknown>): string {
	const fullPath = BASE_URL + path;
	if (!params) return fullPath;

	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			value.forEach((v) => searchParams.append(key, String(v)));
		} else {
			searchParams.set(key, String(value));
		}
	}
	const qs = searchParams.toString();
	return qs ? `${fullPath}?${qs}` : fullPath;
}

async function executeRequest(path: string, options?: RequestOptions): Promise<Response> {
	const isSkipped = AUTH_SKIP_URLS.some((skip) => path.includes(skip));
	const headers: Record<string, string> = {};

	if (!isSkipped) {
		const token = localStorageRepository.get(TOKEN_KEY);
		if (token) headers.Authorization = `Bearer ${token}`;
	}

	let body: BodyInit | undefined;
	if (options?.body instanceof FormData) {
		body = options.body;
	} else if (options?.body !== undefined) {
		headers['Content-Type'] = 'application/json';
		body = JSON.stringify(options.body);
	}

	return fetch(buildUrl(path, options?.params), {
		method: options?.method ?? 'GET',
		headers,
		body,
	});
}

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
	let response = await executeRequest(path, options);

	if (response.status === 401) {
		const isSkipped = AUTH_SKIP_URLS.some((skip) => path.includes(skip));
		if (!isSkipped) {
			const hasRefreshToken = !!localStorageRepository.get(REFRESH_TOKEN_KEY);
			if (hasRefreshToken) {
				try {
					await scheduleRefresh();
					response = await executeRequest(path, options);
				} catch {
					localStorageRepository.remove(TOKEN_KEY);
					localStorageRepository.remove(REFRESH_TOKEN_KEY);
				}
			} else {
				localStorageRepository.remove(TOKEN_KEY);
			}
		}
	}

	if (!response.ok) {
		let data: unknown;
		try {
			data = await response.json();
		} catch {
			/* */
		}
		errorService.handleError(response.status, data);
		throw new Error(`HTTP ${response.status}`);
	}

	if (response.status === 204) return undefined as T;
	return response.json() as Promise<T>;
}

export const http = {
	get: <T>(path: string, params?: Record<string, unknown>) => request<T>(path, { method: 'GET', params }),
	post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
	put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
	putForm: <T>(path: string, formData: FormData) => request<T>(path, { method: 'PUT', body: formData }),
	delete: <T = void>(path: string) => request<T>(path, { method: 'DELETE' }),
};
