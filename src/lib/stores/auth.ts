import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { ApiClient } from '$lib/utils/api-client.js';
import type { User, LoginRequest } from '$lib/types/api.js';

export const user = writable<User | null>(null);
export const isLoggedIn = writable<boolean>(false);
export const isLoading = writable<boolean>(false);

interface LoginResult {
	success: boolean;
	error?: string;
}

// Типы для ответов API (то что возвращает наш SvelteKit endpoint)
interface LoginSuccessResponse {
	success: true;
	user: User;
}

interface LoginErrorResponse {
	success: false;
	error: string;
	errors?: Record<string, string[]> | string[] | string;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

// Функция для логина
export async function login(loginData: LoginRequest): Promise<LoginResult> {
	if (!browser) return { success: false, error: 'Not in browser' };

	isLoading.set(true);

	try {
		// ApiClient теперь возвращает прямой ответ от сервера
		const response = await ApiClient.post<LoginResponse>('/auth/login', loginData);

		if (response.success && 'user' in response) {
			user.set(response.user);
			isLoggedIn.set(true);
			return { success: true };
		} else if (!response.success && 'error' in response) {
			return { success: false, error: response.error };
		} else {
			return { success: false, error: 'Authentication failed' };
		}
	} catch (error) {
		console.error('Login error:', error);
		return { success: false, error: 'Network error occurred' };
	} finally {
		isLoading.set(false);
	}
}

// Функция для логаута
export async function logout(): Promise<void> {
	if (!browser) return;

	isLoading.set(true);

	try {
		await ApiClient.post('/auth/logout');
	} catch (error) {
		console.error('Logout error:', error);
	} finally {
		user.set(null);
		isLoggedIn.set(false);
		isLoading.set(false);
		await goto('/login');
	}
}

// Функция для проверки статуса авторизации на клиенте
export function checkAuthStatus(): void {
	if (!browser) return;

	const loggedIn = document.cookie
		.split('; ')
		.find(row => row.startsWith('logged_in='))
		?.split('=')[1];

	isLoggedIn.set(loggedIn === 'true');
}

// Функция для инициализации состояния авторизации
export function initAuthState(): void {
	checkAuthStatus();
}

// Автоматическая проверка при загрузке
if (browser) {
	checkAuthStatus();
}