import type { ApiResponse, ApiErrorResponse } from '$lib/types/api.js';

/**
 * Извлекает понятное сообщение об ошибке из API ответа
 * Поддерживает все форматы errors с бэкенда
 */
export function extractErrorMessage(apiData: ApiResponse | ApiErrorResponse | any): string {
	// Проверяем errors в разных форматах
	if (apiData.errors) {
		// 1. Массив строк: ["Неверный логин или пароль"]
		if (Array.isArray(apiData.errors) && apiData.errors.length > 0) {
			return apiData.errors[0];
		}

		// 2. Объект с полями: {"login": ["Поле обязательно"], "password": ["Слишком короткий"]}
		if (typeof apiData.errors === 'object' && !Array.isArray(apiData.errors)) {
			const firstFieldError = Object.values(apiData.errors)[0];
			if (Array.isArray(firstFieldError) && firstFieldError.length > 0) {
				return firstFieldError[0];
			}
			if (typeof firstFieldError === 'string') {
				return firstFieldError;
			}
		}

		// 3. Простая строка: "Что-то пошло не так"
		if (typeof apiData.errors === 'string') {
			return apiData.errors;
		}
	}

	// Fallback к message
	return apiData.message || 'Произошла ошибка';
}

/**
 * Извлекает ошибки для конкретного поля (для форм)
 */
export function extractFieldErrors(apiData: ApiResponse | ApiErrorResponse | any, fieldName: string): string[] {
	if (!apiData.errors || typeof apiData.errors !== 'object' || Array.isArray(apiData.errors)) {
		return [];
	}

	const fieldErrors = apiData.errors[fieldName];
	if (Array.isArray(fieldErrors)) {
		return fieldErrors;
	}
	if (typeof fieldErrors === 'string') {
		return [fieldErrors];
	}

	return [];
}

/**
 * Проверяет, есть ли ошибки для конкретного поля
 */
export function hasFieldErrors(apiData: ApiResponse | ApiErrorResponse | any, fieldName: string): boolean {
	return extractFieldErrors(apiData, fieldName).length > 0;
}

/**
 * Получает все ошибки в виде плоского массива
 */
export function getAllErrors(apiData: ApiResponse | ApiErrorResponse | any): string[] {
	const errors: string[] = [];

	if (apiData.errors) {
		// Массив
		if (Array.isArray(apiData.errors)) {
			errors.push(...apiData.errors);
		}
		// Объект с полями
		else if (typeof apiData.errors === 'object') {
			Object.values(apiData.errors).forEach(fieldErrors => {
				if (Array.isArray(fieldErrors)) {
					errors.push(...fieldErrors);
				} else if (typeof fieldErrors === 'string') {
					errors.push(fieldErrors);
				}
			});
		}
		// Строка
		else if (typeof apiData.errors === 'string') {
			errors.push(apiData.errors);
		}
	}

	// Добавляем message если нет других ошибок
	if (errors.length === 0 && apiData.message) {
		errors.push(apiData.message);
	}

	return errors;
}

/**
 * Форматирует ошибки для отображения пользователю
 */
export function formatErrorsForDisplay(apiData: ApiResponse | ApiErrorResponse | any): {
	mainError: string;
	fieldErrors: Record<string, string[]>;
	allErrors: string[];
} {
	return {
		mainError: extractErrorMessage(apiData),
		fieldErrors: typeof apiData.errors === 'object' && !Array.isArray(apiData.errors)
			? apiData.errors
			: {},
		allErrors: getAllErrors(apiData)
	};
}