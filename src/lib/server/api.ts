import { PHP_API_URL } from '$env/static/private';
import type { ApiResponse, HttpMethod } from '$lib/types/api.js';

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

	const url = `${PHP_API_URL}${endpoint}`;

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