import { browser } from '$app/environment';

/**
 * Проверяет, авторизован ли пользователь на клиенте
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
 * Очищает все куки авторизации
 */
export function clearAuthCookies(): void {
	if (!browser) return;

	document.cookie = 'logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
	// HttpOnly куки не можем удалить на клиенте, они удаляются сервером
}

/**
 * Получает CSRF токен из мета-тега (если используется)
 */
export function getCSRFToken(): string | null {
	if (!browser) return null;

	const meta = document.querySelector('meta[name="csrf-token"]');
	return meta ? meta.getAttribute('content') : null;
}

/**
 * Создает заголовки для API запросов
 */
export function createAPIHeaders(includeCSRF = false): Record<string, string> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (includeCSRF) {
		const csrfToken = getCSRFToken();
		if (csrfToken) {
			headers['X-CSRF-Token'] = csrfToken;
		}
	}

	return headers;
}

/**
 * Обработчик ошибок API
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

interface RefreshResponse {
	success?: boolean;
}

/**
 * Проверяет, истекла ли сессия и нужно ли обновить токен
 */
export async function checkAndRefreshToken(): Promise<boolean> {
	if (!browser || !isLoggedInClient()) {
		return false;
	}

	try {
		const response = await fetch('/api/auth/refresh', {
			method: 'POST',
			headers: createAPIHeaders(),
		});

		if (response.ok) {
			const data = await response.json() as RefreshResponse;
			return data.success === true;
		}

		return false;
	} catch (error) {
		console.error('Token refresh failed:', error);
		return false;
	}
}