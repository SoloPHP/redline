<script lang="ts">
	import { Button, Card, Alert } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		UserCircleSolid,
		ArrowRightToBracketOutline
	} from 'flowbite-svelte-icons';
	import { isLoggedIn, user } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';

	function handleLogin() {
		goto('/login');
	}

	function handleDashboard() {
		goto('/dashboard');
	}
</script>

<svelte:head>
	<title>Redline - Главная</title>
</svelte:head>

<div class="container mx-auto p-8 min-h-screen">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
				Добро пожаловать в Redline
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-400">
				SvelteKit + Tailwind v4 + Flowbite + JWT Authentication
			</p>
		</div>

		<!-- Status Card -->
		<Card class="max-w-2xl mx-auto mb-8">
			<Alert color="blue">
				<InfoCircleSolid slot="icon" class="w-4 h-4" />
				<span class="font-medium">Статус системы:</span>
				SvelteKit + Tailwind v4 + Flowbite + JWT авторизация настроены и работают
			</Alert>

			{#if $isLoggedIn && $user}
				<!-- Пользователь авторизован -->
				<div class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<UserCircleSolid class="w-6 h-6 text-green-600 mr-3" />
							<div>
								<p class="text-green-800 dark:text-green-400 font-medium">
									Вы авторизованы
								</p>
								<p class="text-green-600 dark:text-green-500 text-sm">
									Добро пожаловать, {$user.login}!
								</p>
							</div>
						</div>
						<Button onclick={handleDashboard} color="green" size="sm">
							Перейти в Dashboard
						</Button>
					</div>
				</div>
			{:else}
				<!-- Пользователь не авторизован -->
				<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<ArrowRightToBracketOutline class="w-6 h-6 text-blue-600 mr-3" />
							<div>
								<p class="text-blue-800 dark:text-blue-400 font-medium">
									Не авторизован
								</p>
								<p class="text-blue-600 dark:text-blue-500 text-sm">
									Войдите в систему для доступа к функциям
								</p>
							</div>
						</div>
						<Button onclick={handleLogin} color="blue" size="sm">
							<ArrowRightToBracketOutline class="w-4 h-4 mr-2" />
							Войти
						</Button>
					</div>
				</div>
			{/if}
		</Card>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
			<Card class="p-6">
				<div class="flex items-center mb-4">
					<div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h3 class="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
						JWT Authentication
					</h3>
				</div>
				<p class="text-gray-600 dark:text-gray-400">
					Безопасная авторизация с использованием JWT токенов и HttpOnly куки
				</p>
			</Card>

			<Card class="p-6">
				<div class="flex items-center mb-4">
					<div class="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
							<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
						</svg>
					</div>
					<h3 class="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
						SvelteKit 2
					</h3>
				</div>
				<p class="text-gray-600 dark:text-gray-400">
					Современный фреймворк с server-side rendering и защищенными маршрутами
				</p>
			</Card>

			<Card class="p-6">
				<div class="flex items-center mb-4">
					<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
						<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clip-rule="evenodd" />
						</svg>
					</div>
					<h3 class="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
						Tailwind CSS v4
					</h3>
				</div>
				<p class="text-gray-600 dark:text-gray-400">
					Новейшая версия Tailwind CSS с улучшенной производительностью
				</p>
			</Card>
		</div>

		<!-- CTA Section -->
		<Card class="text-center p-8">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
				Готово к работе!
			</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-6">
				Система аутентификации настроена и готова к использованию.
				Войдите в систему для доступа к защищенным функциям.
			</p>

			{#if !$isLoggedIn}
				<Button onclick={handleLogin} size="lg" color="primary">
					<ArrowRightToBracketOutline class="w-5 h-5 mr-2" />
					Начать работу
				</Button>
			{:else}
				<Button onclick={handleDashboard} size="lg" color="primary">
					<UserCircleSolid class="w-5 h-5 mr-2" />
					Открыть Dashboard
				</Button>
			{/if}
		</Card>
	</div>
</div>