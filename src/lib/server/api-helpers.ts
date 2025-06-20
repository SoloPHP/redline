import { fail } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import { extractErrorMessage, formatErrorsForDisplay } from '$lib/utils/api-errors.js';
import type { HttpMethod } from '$lib/types/api.js';

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
				status: response.status,
				errors: formatErrorsForDisplay(data)
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
	additionalData?: Record<string, any>
) {
	if (result.success) {
		throw new Error('Cannot create fail response from successful result');
	}

	return fail(result.status, {
		error: result.error,
		rateLimited: result.rateLimited,
		...('errors' in result ? { fieldErrors: result.errors.fieldErrors } : {}),
		...additionalData
	});
}