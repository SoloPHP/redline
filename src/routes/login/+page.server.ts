import { redirect, fail } from '@sveltejs/kit';
import { setAuthCookies } from '$lib/server/auth-utils.js';
import { apiRequest, createFailResponse } from '$lib/server/api-helpers.js';
import type { Actions, PageServerLoad } from './$types';
import type { LoginResponse } from '$lib/types/api.js';

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

		const result = await apiRequest<LoginResponse>(
			'/auth/login',
			'POST',
			{ login, password, remember_me: rememberMe },
			undefined,
			fetch
		);

		if (!result.success) {
			return createFailResponse(result, { login });
		}

		const { access_token, refresh_token } = result.data;

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
			user: result.data.user
		};
	}
};