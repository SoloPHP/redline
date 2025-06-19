import { json } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import { clearAuthCookies } from '$lib/server/auth-utils.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, locals, fetch }) => {
	try {
		const token = cookies.get('jwt_token');

		if (token) {
			try {
				await callPhpApi('/auth/logout', 'POST', {}, token, fetch);
			} catch (error) {
				console.warn('PHP API logout error (ignored):', error);
			}
		}

		// Используем утилиту для очистки куки
		clearAuthCookies(cookies);
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