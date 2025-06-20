import type { ApiResponse } from '$lib/types/api.js';

/**
 * Извлекает понятное сообщение об ошибке из API ответа
 */
export function extractErrorMessage(apiData: ApiResponse): string {
	const { errors, message } = apiData;

	if (!errors) {
		return message || 'Произошла ошибка';
	}

	// Массив строк
	if (Array.isArray(errors) && errors.length > 0) {
		return errors[0];
	}

	// Строка
	if (typeof errors === 'string') {
		return errors;
	}

	// Объект с полями - берем первую ошибку
	if (typeof errors === 'object') {
		const firstError = Object.values(errors)[0];
		if (Array.isArray(firstError) && firstError.length > 0) {
			return firstError[0];
		}
		if (typeof firstError === 'string') {
			return firstError;
		}
	}

	// Fallback
	return message || 'Произошла ошибка';
}