import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { User, LoginRequest } from '$lib/types/api.js';

export const user = writable<User | null>(null);
export const isLoggedIn = writable<boolean>(false);

interface LoginResult {
	success: boolean;
	error?: string;
}

interface LoginSuccessResponse {
	success: true;
	user: User;
}

interface LoginErrorResponse {
	success?: false;
	error: string;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

// Функция для логина
export async function login(loginData: LoginRequest): Promise<LoginResult> {
	try {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginData),
		});

		const data = await response.json() as LoginResponse;

		if (response.ok && data.success && 'user' in data) {
			user.set(data.user);
			isLoggedIn.set(true);
			return { success: true };
		} else {
			const errorMessage = 'error' in data ? data.error : 'Login failed';
			return { success: false, error: errorMessage };
		}
	} catch (error) {
		console.error('Login error:', error);
		return { success: false, error: 'Network error occurred' };
	}
}

// Функция для логаута
export async function logout(): Promise<void> {
	try {
		await fetch('/api/auth/logout', {
			method: 'POST',
		});
	} catch (error) {
		console.error('Logout error:', error);
	} finally {
		user.set(null);
		isLoggedIn.set(false);
		if (browser) {
			await goto('/login');
		}
	}
}

// Функция для проверки статуса авторизации на клиенте
export function checkAuthStatus(): void {
	if (browser) {
		// Проверяем наличие куки logged_in
		const loggedIn = document.cookie
			.split('; ')
			.find(row => row.startsWith('logged_in='))
			?.split('=')[1];

		isLoggedIn.set(loggedIn === 'true');
	}
}

// Автоматическая проверка при загрузке
if (browser) {
	checkAuthStatus();
}