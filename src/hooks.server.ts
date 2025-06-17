import type { Handle } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import type { User } from '$lib/types/api.js';

interface MeResponse {
	user: User;
}

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('jwt_token');

	if (token) {
		try {
			// Верифицируем токен через PHP API
			const { response, data } = await callPhpApi<MeResponse>('/auth/me', 'GET', undefined, token);

			if (response.ok && data.success && data.data?.user) {
				// Токен валидный, сохраняем данные пользователя
				event.locals.user = {
					id: data.data.user.id,
					login: data.data.user.login,
					name: data.data.user.name,
					email: data.data.user.email,
					role: data.data.user.role,
				};
			} else {
				// Токен недействителен, удаляем куки
				event.cookies.delete('jwt_token', { path: '/' });
				event.cookies.delete('logged_in', { path: '/' });
				event.locals.user = null;
			}
		} catch (error) {
			console.error('Auth verification error:', error);
			// В случае ошибки также удаляем куки
			event.cookies.delete('jwt_token', { path: '/' });
			event.cookies.delete('logged_in', { path: '/' });
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};