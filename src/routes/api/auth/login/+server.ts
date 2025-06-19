import { json } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import { setAuthCookies } from '$lib/server/auth-utils.js';
import type { RequestHandler } from './$types';
import type { LoginRequest, LoginResponse } from '$lib/types/api.js';

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	try {
		const body = await request.json();

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

		// Используем event.fetch для запроса к PHP API
		const { response, data } = await callPhpApi<LoginResponse>(
			'/auth/login',
			'POST',
			loginData,
			undefined,
			fetch
		);

		if (!response.ok || !data.success || !data.data) {
			return json(
				{ error: data.message || 'Authentication failed' },
				{ status: response.status || 401 }
			);
		}

		const { access_token, refresh_token, user } = data.data;

		if (!access_token || !refresh_token) {
			return json(
				{ error: 'No tokens received from server' },
				{ status: 500 }
			);
		}

		await setAuthCookies(cookies, access_token, refresh_token, fetch);

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