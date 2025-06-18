import { json } from '@sveltejs/kit';
import { clearAuthCookies, refreshTokens, setAuthCookies } from '$lib/server/auth-utils.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		const refreshToken = cookies.get('refresh_token');

		if (!refreshToken) {
			return json({ success: false, error: 'Refresh token not found' }, { status: 401 });
		}

		const result = await refreshTokens(refreshToken);

		if (result.success && result.accessToken && result.newRefreshToken) {
			await setAuthCookies(cookies, result.accessToken, result.newRefreshToken);
			return json({ success: true });
		} else {
			clearAuthCookies(cookies);
			return json(
				{ success: false, error: result.error || 'Token refresh failed' },
				{ status: 401 }
			);
		}
	} catch (error) {
		console.error('Token refresh error:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};