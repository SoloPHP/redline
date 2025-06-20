import { redirect, fail } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import { setAuthCookies } from '$lib/server/auth-utils.js';
import type { Actions, PageServerLoad } from './$types';
import type { LoginResponse } from '$lib/types/api.js';

/**
 * Извлекает понятное сообщение об ошибке из API ответа
 */
function extractErrorMessage(apiData: any): string {
	// Сначала пробуем errors
	if (apiData.errors) {
		// Если errors - массив, берем первый элемент
		if (Array.isArray(apiData.errors) && apiData.errors.length > 0) {
			return apiData.errors[0];
		}

		// Если errors - объект с полями, берем первую ошибку
		if (typeof apiData.errors === 'object' && !Array.isArray(apiData.errors)) {
			const firstFieldError = Object.values(apiData.errors)[0];
			if (Array.isArray(firstFieldError) && firstFieldError.length > 0) {
				return firstFieldError[0];
			}
			if (typeof firstFieldError === 'string') {
				return firstFieldError;
			}
		}

		// Если errors - просто строка
		if (typeof apiData.errors === 'string') {
			return apiData.errors;
		}
	}

	// Если нет errors или они пустые, используем message
	return apiData.message || 'Ошибка авторизации';
}

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies, fetch }) => {
		const data = await request.formData();
		const login = data.get('login')?.toString();
		const password = data.get('password')?.toString();
		const rememberMe = data.get('remember_me')?.toString() === 'true';

		if (!login || !password) {
			return fail(400, {
				error: 'Логин и пароль обязательны',
				login,
				rateLimited: false
			});
		}

		try {
			const requestBody = {
				login,
				password,
				remember_me: rememberMe
			};

			const { response, data: apiData } = await callPhpApi<LoginResponse>(
				'/auth/login',
				'POST',
				requestBody,
				undefined,
				fetch
			);

			// Обработка rate limit (HTTP 429)
			if (response.status === 429) {
				return fail(429, {
					error: 'Превышен лимит попыток входа. Попробуйте позже.',
					login,
					rateLimited: true
				});
			}

			if (!response.ok || !apiData.success || !apiData.data) {
				return fail(response.status === 401 ? 401 : 500, {
					error: extractErrorMessage(apiData),
					login,
					rateLimited: false
				});
			}

			const { access_token, refresh_token } = apiData.data;

			if (!access_token || !refresh_token) {
				return fail(500, {
					error: 'Не получены токены с сервера',
					login,
					rateLimited: false
				});
			}

			await setAuthCookies(cookies, access_token, refresh_token, fetch);

			return {
				success: true,
				user: apiData.data.user
			};
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, {
				error: 'Внутренняя ошибка сервера',
				login,
				rateLimited: false
			});
		}
	}
};