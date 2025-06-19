import { browser } from '$app/environment';

/**
 * Проверяет, авторизован ли пользователь на клиенте
 * Используется для реактивности UI
 */
export function isLoggedInClient(): boolean {
	if (!browser) return false;

	const loggedIn = document.cookie
		.split('; ')
		.find(row => row.startsWith('logged_in='))
		?.split('=')[1];

	return loggedIn === 'true';
}

/**
 * Обработчик ошибок API для клиентской части
 */
export function handleAPIError(error: unknown): string {
	if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
		return error.message;
	}

	if (typeof error === 'string') {
		return error;
	}

	return 'Произошла неизвестная ошибка';
}