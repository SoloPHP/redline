// Базовые типы для API
export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	message?: string;
	errors?: Record<string, string[]> | string[] | string;
}

// Типы для авторизации
export interface LoginRequest {
	login: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	refresh_token?: string;
	user: User;
}

export interface RefreshResponse {
	access_token: string;
	refresh_token?: string;
	user?: User;
}

export interface User {
	id: string;
	login: string;
	// Добавьте другие поля пользователя по необходимости
	name?: string;
	email?: string;
	role?: string;
}

// Типы ошибок
export interface ApiErrorResponse {
	success: false;
	message: string;
	errors?: Record<string, string[]> | string[] | string;
}

// HTTP методы
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Опции для API запросов
export interface ApiRequestOptions {
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: unknown;
}