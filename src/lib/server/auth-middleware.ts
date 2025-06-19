// src/lib/server/auth-middleware.ts
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Middleware для проверки авторизации на защищенных страницах
 */
export function requireAuth(event: RequestEvent) {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}
	return event.locals.user;
}

/**
 * Middleware для перенаправления авторизованных пользователей
 */
export function requireGuest(event: RequestEvent) {
	if (event.locals.user) {
		throw redirect(302, '/dashboard');
	}
}