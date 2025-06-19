import { redirect, fail } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import { setAuthCookies } from '$lib/server/auth-utils.js';
import type { Actions, PageServerLoad } from './$types';
import type { LoginRequest, LoginResponse } from '$lib/types/api.js';

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
				login
			});
		}

		try {
			const { response, data: apiData } = await callPhpApi<LoginResponse>(
				'/auth/login',
				'POST',
				{ login, password, remember_me: rememberMe },
				undefined,
				fetch
			);

			if (!response.ok || !apiData.success || !apiData.data) {
				return fail(401, {
					error: apiData.message || 'Ошибка авторизации',
					login
				});
			}

			const { access_token, refresh_token } = apiData.data;

			if (!access_token || !refresh_token) {
				return fail(500, {
					error: 'Не получены токены с сервера',
					login
				});
			}

			await setAuthCookies(cookies, access_token, refresh_token, fetch);

			// Возвращаем успех вместо redirect
			return {
				success: true,
				user: apiData.data.user
			};
		} catch (error) {
			console.error('Login error:', error);
			return fail(500, {
				error: 'Внутренняя ошибка сервера',
				login
			});
		}
	}
};