import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Если пользователь уже авторизован, перенаправляем на дашборд
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}

	return {};
};