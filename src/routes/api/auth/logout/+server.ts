import { json } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	try {
		const token = cookies.get('jwt_token');

		if (token) {
			// Опционально: уведомляем PHP API о логауте
			try {
				await callPhpApi('/auth/logout', 'POST', {}, token);
			} catch (error) {
				// Игнорируем ошибки от PHP API при логауте
				console.warn('PHP API logout error (ignored):', error);
			}
		}

		// Удаляем все куки
		const cookieOptions = {
			path: '/',
			secure: process.env.NODE_ENV === 'production',
		};

		cookies.delete('jwt_token', cookieOptions);
		cookies.delete('logged_in', cookieOptions);
		cookies.delete('refresh_token', cookieOptions);

		// Очищаем locals
		locals.user = null;

		return json({ success: true });

	} catch (error) {
		console.error('Logout error:', error);
		return json(
			{ error: 'Logout failed' },
			{ status: 500 }
		);
	}
};