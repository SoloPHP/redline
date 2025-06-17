import { json } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import type { RequestHandler } from './$types';
import type { RefreshResponse } from '$lib/types/api.js';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		const refreshToken = cookies.get('refresh_token');

		if (!refreshToken) {
			return json(
				{ error: 'Refresh token not found' },
				{ status: 401 }
			);
		}

		// Обновляем токен через PHP API
		const { response, data } = await callPhpApi<RefreshResponse>('/auth/refresh', 'POST', {}, refreshToken);

		if (!response.ok || !data.success || !data.data) {
			// Refresh token недействителен, удаляем все куки
			const cookieOptions = {
				path: '/',
				secure: process.env.NODE_ENV === 'production',
			};

			cookies.delete('jwt_token', cookieOptions);
			cookies.delete('logged_in', cookieOptions);
			cookies.delete('refresh_token', cookieOptions);

			return json(
				{ error: data.message || 'Token refresh failed' },
				{ status: 401 }
			);
		}

		const { access_token, refresh_token: newRefreshToken } = data.data;

		// Устанавливаем новые токены
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict' as const,
			path: '/',
		};

		cookies.set('jwt_token', access_token, {
			...cookieOptions,
			maxAge: 60 * 60 * 24 * 7, // 7 дней
		});

		if (newRefreshToken) {
			cookies.set('refresh_token', newRefreshToken, {
				...cookieOptions,
				maxAge: 60 * 60 * 24 * 30, // 30 дней
			});
		}

		return json({ success: true });

	} catch (error) {
		console.error('Token refresh error:', error);
		return json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};