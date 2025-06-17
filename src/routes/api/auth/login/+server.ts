import { json } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import type { RequestHandler } from './$types';
import type { LoginRequest, LoginResponse } from '$lib/types/api.js';

interface RequestBody {
	login?: string;
	password?: string;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const body = await request.json() as RequestBody;

		// Валидация входных данных
		if (!body.login || !body.password) {
			return json(
				{ error: 'Login and password are required' },
				{ status: 400 }
			);
		}

		const loginData: LoginRequest = {
			login: body.login,
			password: body.password
		};

		// Вызываем PHP API для логина
		const { response, data } = await callPhpApi<LoginResponse>('/auth/login', 'POST', loginData);

		if (!response.ok || !data.success || !data.data) {
			return json(
				{ error: data.message || 'Authentication failed' },
				{ status: response.status || 401 }
			);
		}

		// PHP API возвращает токены в теле ответа
		const { access_token, refresh_token, user } = data.data;

		if (!access_token) {
			return json(
				{ error: 'No access token received from server' },
				{ status: 500 }
			);
		}

		// Устанавливаем HttpOnly куки в SvelteKit
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict' as const,
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 дней
		};

		cookies.set('jwt_token', access_token, cookieOptions);

		// Дополнительная кука для клиента (чтобы знать, залогинен ли пользователь)
		cookies.set('logged_in', 'true', {
			...cookieOptions,
			httpOnly: false, // Эта кука доступна JavaScript
		});

		// Опционально сохраняем refresh token
		if (refresh_token) {
			cookies.set('refresh_token', refresh_token, {
				...cookieOptions,
				maxAge: 60 * 60 * 24 * 30, // 30 дней для refresh token
			});
		}

		return json({
			success: true,
			user: {
				id: user.id,
				login: user.login,
				name: user.name,
				email: user.email,
				role: user.role,
			}
		});

	} catch (error) {
		console.error('Login error:', error);
		return json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};