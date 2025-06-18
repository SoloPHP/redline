import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Если пользователь авторизован - направляем в dashboard
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}

	// Если не авторизован - направляем на login
	throw redirect(302, '/login');
};