import { redirect } from '@sveltejs/kit';
import { clearAuthCookies } from '$lib/server/auth-utils.js';
import { callPhpApi } from '$lib/server/api.js';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ cookies, fetch }) => {
		const token = cookies.get('jwt_token');

		if (token) {
			try {
				await callPhpApi('/auth/logout', 'POST', {}, token, fetch);
			} catch (error) {
				console.warn('PHP API logout error:', error);
			}
		}

		clearAuthCookies(cookies);
		throw redirect(302, '/login');
	}
};