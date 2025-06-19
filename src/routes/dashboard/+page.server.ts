// src/routes/dashboard/+page.server.ts
import { requireAuth } from '$lib/server/auth-middleware.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = requireAuth(event);

	return {
		user
	};
};