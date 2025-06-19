import { browser } from '$app/environment';
import type { HttpMethod } from '$lib/types/api.js';

interface ApiClientOptions {
	method?: HttpMethod;
	body?: unknown;
	headers?: Record<string, string>;
}

// Убираем дублирование - возвращаем точно то, что пришло с сервера
export class ApiClient {
	/**
	 * Базовый метод для запросов к нашему SvelteKit API
	 */
	static async request<T = unknown>(
		endpoint: string,
		options: ApiClientOptions = {}
	): Promise<T> {
		if (!browser) {
			throw new Error('API client can only be used in browser');
		}

		const { method = 'GET', body, headers = {} } = options;

		const config: RequestInit = {
			method,
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
		};

		if (body) {
			config.body = JSON.stringify(body);
		}

		try {
			const response = await fetch(`/api${endpoint}`, config);
			const data = await response.json();

			// Возвращаем точно то, что пришло с сервера
			return data as T;
		} catch (error) {
			console.error('API request failed:', error);
			// В случае сетевой ошибки возвращаем стандартную структуру
			return {
				success: false,
				error: 'Network error occurred',
			} as T;
		}
	}

	/**
	 * GET запрос
	 */
	static async get<T = unknown>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: 'GET' });
	}

	/**
	 * POST запрос
	 */
	static async post<T = unknown>(
		endpoint: string,
		body?: unknown
	): Promise<T> {
		return this.request<T>(endpoint, { method: 'POST', body });
	}

	/**
	 * PUT запрос
	 */
	static async put<T = unknown>(
		endpoint: string,
		body?: unknown
	): Promise<T> {
		return this.request<T>(endpoint, { method: 'PUT', body });
	}

	/**
	 * DELETE запрос
	 */
	static async delete<T = unknown>(endpoint: string): Promise<T> {
		return this.request<T>(endpoint, { method: 'DELETE' });
	}
}

/**
 * Утилиты для аутентификации
 */
export class AuthClient {
	/**
	 * Логин пользователя
	 */
	static async login(credentials: { login: string; password: string }) {
		return ApiClient.post('/auth/login', credentials);
	}

	/**
	 * Выход пользователя
	 */
	static async logout() {
		return ApiClient.post('/auth/logout');
	}

	/**
	 * Проверка статуса авторизации по кукам
	 */
	static isLoggedIn(): boolean {
		if (!browser) return false;

		const loggedIn = document.cookie
			.split('; ')
			.find(row => row.startsWith('logged_in='))
			?.split('=')[1];

		return loggedIn === 'true';
	}
}

/**
 * Обработчик ошибок API для случаев когда есть поле error
 */
export function handleApiError(response: any): string {
	if (response.error) {
		return response.error;
	}

	if (response.message) {
		return response.message;
	}

	if (response.errors) {
		if (typeof response.errors === 'string') {
			return response.errors;
		}

		if (Array.isArray(response.errors)) {
			return response.errors.join(', ');
		}

		if (typeof response.errors === 'object') {
			return Object.values(response.errors).flat().join(', ');
		}
	}

	return 'Произошла неизвестная ошибка';
}