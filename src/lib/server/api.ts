import { PHP_API_URL } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { extractErrorMessage } from '$lib/utils/api-errors.js';
import type { ApiResponse, HttpMethod } from '$lib/types/api.js';

// ========================================
// БАЗОВЫЕ API ФУНКЦИИ
// ========================================

export interface ApiCallResult<T = unknown> {
	response: Response;
	data: ApiResponse<T>;
}

export async function callPhpApi<T = unknown>(
	endpoint: string,
	method: HttpMethod = 'GET',
	body?: unknown,
	token?: string,
	fetchFn?: typeof fetch
): Promise<ApiCallResult<T>> {
	const fetchToUse = fetchFn || fetch;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const url = `${PHP_API_URL}${endpoint}`;

	const response = await fetchToUse(url, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	let data: ApiResponse<T>;
	try {
		data = await response.json() as ApiResponse<T>;
	} catch {
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

// ========================================
// ВЫСОКОУРОВНЕВЫЕ API ФУНКЦИИ
// ========================================

/**
 * Обертка для API вызовов с автоматической обработкой ошибок
 */
export async function apiRequest<T>(
	endpoint: string,
	method: HttpMethod = 'GET',
	body?: unknown,
	token?: string,
	fetchFn?: typeof fetch
) {
	try {
		const { response, data } = await callPhpApi<T>(endpoint, method, body, token, fetchFn);

		if (!response.ok || !data.success) {
			// Специальная обработка rate limit
			if (response.status === 429) {
				return {
					success: false,
					error: 'Превышен лимит запросов. Попробуйте позже.',
					rateLimited: true,
					status: 429
				};
			}

			return {
				success: false,
				error: extractErrorMessage(data),
				rateLimited: false,
				status: response.status
			};
		}

		return {
			success: true,
			data: data.data,
			status: response.status
		};
	} catch (error) {
		console.error(`API request failed [${method} ${endpoint}]:`, error);
		return {
			success: false,
			error: 'Внутренняя ошибка сервера',
			rateLimited: false,
			status: 500
		};
	}
}

/**
 * Создает fail() ответ на основе результата API
 */
export function createFailResponse(
	result: Awaited<ReturnType<typeof apiRequest>>,
	additionalData?: Record<string, unknown>
) {
	if (result.success) {
		throw new Error('Cannot create fail response from successful result');
	}

	return fail(result.status, {
		error: result.error,
		rateLimited: result.rateLimited || false,
		...additionalData
	});
}