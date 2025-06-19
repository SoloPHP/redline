import type { Handle } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import { clearAuthCookies, tryRefreshAndSetCookies } from '$lib/server/auth-utils.js';
import type { User } from '$lib/types/api.js';

interface MeResponse {
	user: User;
}

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('jwt_token');
	const refreshToken = event.cookies.get('refresh_token');

	if (token) {
		// Есть access token, проверяем его
		const authResult = await verifyToken(token, event.fetch);

		if (authResult.success && authResult.user) {
			event.locals.user = authResult.user;
		} else {
			// Access token недействителен, пробуем refresh
			const refreshSuccess = await tryRefreshAndSetCookies(
				refreshToken,
				event.cookies,
				event.fetch
			);

			if (refreshSuccess) {
				// Повторно проверяем с новым токеном
				const newToken = event.cookies.get('jwt_token');
				if (newToken) {
					const newAuthResult = await verifyToken(newToken, event.fetch);
					if (newAuthResult.success && newAuthResult.user) {
						event.locals.user = newAuthResult.user;
					} else {
						clearAuthCookies(event.cookies);
						event.locals.user = null;
					}
				}
			} else {
				clearAuthCookies(event.cookies);
				event.locals.user = null;
			}
		}
	} else if (refreshToken) {
		// Нет access token, но есть refresh token
		const refreshSuccess = await tryRefreshAndSetCookies(
			refreshToken,
			event.cookies,
			event.fetch // Передаем event.fetch
		);

		if (refreshSuccess) {
			const newToken = event.cookies.get('jwt_token');
			if (newToken) {
				const authResult = await verifyToken(newToken, event.fetch);
				if (authResult.success && authResult.user) {
					event.locals.user = authResult.user;
				}
			}
		} else {
			clearAuthCookies(event.cookies);
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
};

/**
 * Проверяет токен через PHP API
 */
async function verifyToken(
	token: string,
	fetchFn: typeof fetch
): Promise<{
	success: boolean;
	user?: User;
}> {
	try {
		const { response, data } = await callPhpApi<MeResponse>(
			'/auth/me',
			'GET',
			undefined,
			token,
			fetchFn // Передаем event.fetch в API
		);

		if (response.ok && data.success && data.data?.user) {
			return { success: true, user: data.data.user };
		}

		return { success: false };
	} catch (error) {
		console.error('Auth verification error:', error);
		return { success: false };
	}
}