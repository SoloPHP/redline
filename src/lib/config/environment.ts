// src/lib/config/environment.ts
interface EnvironmentConfig {
	apiUrl: string;
	isDevelopment: boolean;
	isProduction: boolean;
}

function getEnvironmentConfig(): EnvironmentConfig {
	const isDevelopment = process.env.NODE_ENV === 'development';
	const isProduction = process.env.NODE_ENV === 'production';

	// Проверяем Vercel окружение
	const isVercel = process.env.VERCEL === '1';

	let apiUrl: string;

	if (isProduction || isVercel) {
		// Production - используем переменную из Vercel
		apiUrl = process.env.PHP_API_URL || 'https://your-production-api.com/api';
	} else {
		// Development - используем локальный API
		apiUrl = process.env.PHP_API_URL || 'http://localhost:8000/api';
	}

	return {
		apiUrl,
		isDevelopment,
		isProduction
	};
}

export const ENV = getEnvironmentConfig();