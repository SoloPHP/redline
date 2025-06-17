<script lang="ts">
	import { Button, Card, Alert } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		UserCircleSolid,
		ArrowRightAltSolid
	} from 'flowbite-svelte-icons';
	import { logout } from '$lib/stores/auth.js';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	async function handleLogout() {
		await logout();
	}
</script>

<svelte:head>
	<title>Dashboard - Redline</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Header -->
	<header class="bg-white dark:bg-gray-800 shadow">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center py-6">
				<div class="flex items-center">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
						Dashboard
					</h1>
				</div>
				<div class="flex items-center space-x-4">
					<div class="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
						<UserCircleSolid class="w-5 h-5" />
						<span>{data.user?.login}</span>
					</div>
					<Button
						onclick={handleLogout}
						color="alternative"
						size="sm"
					>
						<ArrowRightAltSolid class="w-4 h-4 mr-2" />
						Выйти
					</Button>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<Alert color="green" class="mb-6">
				<InfoCircleSolid slot="icon" class="w-4 h-4" />
				<span class="font-medium">Успешно!</span>
				Вы успешно авторизовались в системе
			</Alert>

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Информация о пользователе -->
				<Card class="p-6">
					<div class="flex items-center">
						<UserCircleSolid class="w-8 h-8 text-primary-600 mr-3" />
						<div>
							<h3 class="text-lg font-medium text-gray-900 dark:text-white">
								Профиль пользователя
							</h3>
							<p class="text-gray-500 dark:text-gray-400">
								ID: {data.user?.id}
							</p>
							<p class="text-gray-500 dark:text-gray-400">
								Логин: {data.user?.login}
							</p>
						</div>
					</div>
				</Card>

				<!-- Статистика -->
				<Card class="p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
									<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
								</svg>
							</div>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-medium text-gray-900 dark:text-white">
								Статистика
							</h3>
							<p class="text-gray-500 dark:text-gray-400">
								JWT авторизация работает
							</p>
						</div>
					</div>
				</Card>

				<!-- Настройки -->
				<Card class="p-6">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-8 h-8 bg-secondary-100 rounded-md flex items-center justify-center">
								<svg class="w-5 h-5 text-secondary-600" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
								</svg>
							</div>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-medium text-gray-900 dark:text-white">
								Настройки
							</h3>
							<p class="text-gray-500 dark:text-gray-400">
								Управление аккаунтом
							</p>
						</div>
					</div>
				</Card>
			</div>

			<!-- Дополнительная информация -->
			<Card class="mt-8 p-6">
				<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
					Информация о сессии
				</h3>
				<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
					<pre class="text-sm text-gray-600 dark:text-gray-400">{JSON.stringify(data.user, null, 2)}</pre>
				</div>
			</Card>
		</div>
	</main>
</div>