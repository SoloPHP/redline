import { dev } from '$app/environment';
import type { ApiResponse, HttpMethod } from '$lib/types/api.js';

// Функция для получения API URL
function getApiUrl(): string {
	// Пытаемся получить из переменных окружения разными способами
	let apiUrl: string | undefined;

	// Для Vercel и других платформ
	if (typeof process !== 'undefined' && process.env.PHP_API_URL) {
		apiUrl = process.env.PHP_API_URL;
	}

	// Fallback для разработки
	if (!apiUrl && dev) {
		apiUrl = 'http://localhost:8000/api';
		console.warn('Using development API URL. Set PHP_API_URL environment variable for production.');
	}

	if (!apiUrl) {
		throw new Error(
			'PHP_API_URL environment variable is required. ' +
			'Please set it in your Vercel project settings or .env file.'
		);
	}

	return apiUrl;
}

export interface ApiCallResult<T = unknown> {
	response: Response;
	data: ApiResponse<T>;
}

export async function callPhpApi<T = unknown>(
	endpoint: string,
	method: HttpMethod = 'GET',
	body?: unknown,
	token?: string
): Promise<ApiCallResult<T>> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const url = `${getApiUrl()}${endpoint}`;

	try {
		const response = await fetch(url, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});

		let data: ApiResponse<T>;
		try {
			data = await response.json() as ApiResponse<T>;
		} catch (error) {
			// Если ответ не JSON, создаем стандартную структуру
			data = {
				success: response.ok,
				message: response.ok ? 'Success' : `HTTP ${response.status}: ${response.statusText}`
			};
		}

		return { response, data };
	} catch (error) {
		console.error('API call failed:', error);
		throw new ApiError(
			'Network error occurred',
			0,
			'Failed to connect to API server'
		);
	}
}

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public errors?: Record<string, string[]> | string[] | string
	) {
		super(message);
		this.name = 'ApiError';
	}
}