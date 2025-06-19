<script lang="ts">
	import { Button, Card, Input, Label, Alert, Checkbox } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		EyeSolid,
		EyeSlashSolid,
		MoonOutline,
		SunOutline
	} from 'flowbite-svelte-icons';
	import { login, isLoading } from '$lib/stores/auth.js'; // Используем обновленный store
	import { theme } from '$lib/stores/theme.js';
	import { goto } from '$app/navigation';

	let loginForm = $state({
		login: '',
		password: ''
	});

	let error = $state('');
	let showPassword = $state(false);
	let rememberMe = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!loginForm.login || !loginForm.password) {
			error = 'Пожалуйста, заполните все поля';
			return;
		}

		error = '';

		try {
			const result = await login(loginForm);

			if (result.success) {
				await goto('/dashboard');
			} else {
				error = result.error || 'Ошибка авторизации';
			}
		} catch (err) {
			error = 'Произошла ошибка сети';
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function toggleTheme() {
		theme.toggle();
	}
</script>

<svelte:head>
	<title>Авторизация - Redline</title>
</svelte:head>

<div class="min-h-screen flex">
	<!-- Left side - Login form -->
	<div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
		<div class="max-w-md w-full space-y-8">
			<!-- Header -->
			<div class="text-center">
				<div class="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4">
					<span class="text-white font-bold text-2xl">R</span>
				</div>
				<h2 class="text-3xl font-bold text-gray-900 dark:text-white">
					Добро пожаловать
				</h2>
				<p class="mt-2 text-gray-600 dark:text-gray-400">
					Войдите в свой аккаунт
				</p>
			</div>

			<!-- Theme toggle -->
			<div class="flex justify-center">
				<Button onclick={toggleTheme} color="alternative" size="sm" class="!p-2">
					{#if $theme === 'dark'}
						<SunOutline class="w-5 h-5" />
					{:else}
						<MoonOutline class="w-5 h-5" />
					{/if}
				</Button>
			</div>

			<!-- Form -->
			<Card class="p-8 shadow-xl border-0">
				{#if error}
					<Alert color="red" class="mb-6">
						<InfoCircleSolid slot="icon" class="w-4 h-4" />
						<span class="font-medium">Ошибка!</span>
						{error}
					</Alert>
				{/if}

				<form onsubmit={handleSubmit} class="space-y-6">
					<div>
						<Label for="login" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Логин
						</Label>
						<Input
							id="login"
							name="login"
							type="text"
							autocomplete="username"
							required
							placeholder="Введите ваш логин"
							bind:value={loginForm.login}
							disabled={$isLoading}
							class="block w-full"
						/>
					</div>

					<div>
						<Label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Пароль
						</Label>
						<div class="relative">
							<Input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								autocomplete="current-password"
								required
								placeholder="Введите ваш пароль"
								bind:value={loginForm.password}
								disabled={$isLoading}
								class="block w-full pr-12"
							/>
							<button
								type="button"
								class="absolute inset-y-0 right-0 pr-3 flex items-center"
								onclick={togglePasswordVisibility}
								disabled={$isLoading}
							>
								{#if showPassword}
									<EyeSlashSolid class="w-5 h-5 text-gray-400 hover:text-gray-600" />
								{:else}
									<EyeSolid class="w-5 h-5 text-gray-400 hover:text-gray-600" />
								{/if}
							</button>
						</div>
					</div>

					<div class="flex items-center justify-between">
						<Checkbox bind:checked={rememberMe} class="text-sm" disabled={$isLoading}>
							Запомнить меня
						</Checkbox>
						<button
							type="button"
							class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 disabled:opacity-50"
							disabled={$isLoading}
						>
							Забыли пароль?
						</button>
					</div>

					<Button
						type="submit"
						class="w-full !py-3"
						disabled={$isLoading}
						color="primary"
						size="lg"
					>
						{#if $isLoading}
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Вход...
						{:else}
							Войти в систему
						{/if}
					</Button>
				</form>

				<div class="mt-6 text-center">
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Нет аккаунта?
						<button
							class="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium disabled:opacity-50"
							disabled={$isLoading}
						>
							Зарегистрироваться
						</button>
					</p>
				</div>
			</Card>
		</div>
	</div>

	<!-- Right side - Brand/Image -->
	<div class="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
		<div class="flex items-center justify-center w-full">
			<div class="text-center max-w-md">
				<div class="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
					<span class="text-white font-bold text-5xl">R</span>
				</div>
				<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Redline CRM
				</h3>
				<p class="text-gray-600 dark:text-gray-400 leading-relaxed">
					Современная система управления с защищенной авторизацией и удобным интерфейсом
				</p>
			</div>
		</div>
	</div>
</div>