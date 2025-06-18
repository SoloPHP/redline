import type { Cookies } from '@sveltejs/kit';
import { callPhpApi } from '$lib/server/api.js';
import type { RefreshResponse } from '$lib/types/api.js';

interface TokenSettings {
	access_token_lifetime: number;
	refresh_token_lifetime: number;
}

interface TokenSettingsResponse {
	access_token_lifetime: number;
	refresh_token_lifetime: number;
}

let cachedTokenSettings: TokenSettings | null = null;

/**
 * Получает настройки токенов с кешированием
 */
async function getTokenSettings(): Promise<TokenSettings> {
	if (cachedTokenSettings) {
		return cachedTokenSettings;
	}

	try {
		const { response, data } = await callPhpApi<TokenSettingsResponse>('/config/token-settings', 'GET');

		if (response.ok && data.success && data.data) {
			cachedTokenSettings = {
				access_token_lifetime: data.data.access_token_lifetime,
				refresh_token_lifetime: data.data.refresh_token_lifetime
			};
			return cachedTokenSettings;
		}
	} catch (error) {
		console.warn('Failed to load token settings from PHP API, using defaults:', error);
	}

	// Fallback настройки
	cachedTokenSettings = {
		access_token_lifetime: 900, // 15 минут
		refresh_token_lifetime: 604800 // 7 дней
	};

	return cachedTokenSettings;
}

/**
 * Создает базовые опции для куки
 */
function createCookieOptions() {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict' as const,
		path: '/'
	};
}

/**
 * Устанавливает токены в куки
 */
export async function setAuthCookies(
	cookies: Cookies,
	accessToken: string,
	refreshToken: string
): Promise<void> {
	const settings = await getTokenSettings();
	const cookieOptions = createCookieOptions();

	cookies.set('jwt_token', accessToken, {
		...cookieOptions,
		maxAge: settings.access_token_lifetime
	});

	cookies.set('refresh_token', refreshToken, {
		...cookieOptions,
		maxAge: settings.refresh_token_lifetime
	});

	cookies.set('logged_in', 'true', {
		...cookieOptions,
		httpOnly: false,
		maxAge: settings.refresh_token_lifetime
	});
}

/**
 * Очищает все куки авторизации
 */
export function clearAuthCookies(cookies: Cookies): void {
	const cookieOptions = {
		path: '/',
		secure: process.env.NODE_ENV === 'production'
	};

	cookies.delete('jwt_token', cookieOptions);
	cookies.delete('refresh_token', cookieOptions);
	cookies.delete('logged_in', cookieOptions);
}

/**
 * Обновляет токены через PHP API
 */
export async function refreshTokens(refreshToken: string): Promise<{
	success: boolean;
	accessToken?: string;
	newRefreshToken?: string;
	error?: string;
}> {
	try {
		const { response, data } = await callPhpApi<RefreshResponse>('/auth/refresh', 'POST', {
			refresh_token: refreshToken
		});

		if (response.ok && data.success && data.data) {
			const { access_token, refresh_token: newRefreshToken } = data.data;

			if (access_token && newRefreshToken) {
				return {
					success: true,
					accessToken: access_token,
					newRefreshToken: newRefreshToken
				};
			}
		}

		return {
			success: false,
			error: data.message || 'Token refresh failed'
		};
	} catch (error) {
		console.error('Token refresh failed:', error);
		return {
			success: false,
			error: 'Internal server error'
		};
	}
}

/**
 * Пытается обновить токены и установить новые куки
 */
export async function tryRefreshAndSetCookies(
	refreshToken: string | undefined,
	cookies: Cookies
): Promise<boolean> {
	if (!refreshToken) return false;

	const result = await refreshTokens(refreshToken);

	if (result.success && result.accessToken && result.newRefreshToken) {
		await setAuthCookies(cookies, result.accessToken, result.newRefreshToken);
		return true;
	}

	return false;
}