<script lang="ts">
	import { Button, Card, Input, Label, Alert, Checkbox } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		EyeSolid,
		EyeSlashSolid,
		MoonOutline,
		SunOutline
	} from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';
	import { theme } from '$lib/stores/theme.js';
	import { goto } from '$app/navigation';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let showPassword = $state(false);
	let isSubmitting = $state(false);

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

<div class="min-h-screen flex relative">
	<!-- Theme toggle - fixed в правом верхнем углу -->
	<div class="fixed top-6 right-6 z-10">
		<Button
			onclick={toggleTheme}
			color="alternative"
			size="sm"
			class="!p-2 shadow-lg"
		>
			{#if $theme === 'dark'}
				<SunOutline class="w-5 h-5" />
			{:else}
				<MoonOutline class="w-5 h-5" />
			{/if}
		</Button>
	</div>

	<!-- Left side - Login form -->
	<div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
		<div class="max-w-md w-full">
			<!-- Form -->
			<Card class="p-8 shadow-xl border-0">
				<!-- Header внутри формы -->
				<div class="text-center mb-8">
					<div
						class="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4">
						<span class="text-white font-bold text-2xl">R</span>
					</div>
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">
						Добро пожаловать
					</h2>
					<p class="mt-2 text-gray-600 dark:text-gray-400">
						Войдите в свой аккаунт
					</p>
				</div>
				{#if form?.error}
					<Alert color={form.rateLimited ? "yellow" : "red"} class="mb-6">
						<div class="flex items-center">
							<InfoCircleSolid class="w-4 h-4 mr-2" />
							<div>
								<span class="font-medium">
									{form.rateLimited ? "Слишком много попыток!" : "Ошибка!"}
								</span>
								{form.error}
							</div>
						</div>
					</Alert>
				{/if}

				<form
					method="POST"
					action="?/login"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ result, update }) => {
							isSubmitting = false;

							if (result.type === 'success' && result.data?.success) {
								goto('/dashboard');
							} else {
								// Обязательно вызываем update для обновления form data
								await update();
							}
						};
					}}
					class="space-y-6"
				>
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
							value={form?.login ?? ''}
							disabled={isSubmitting}
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
								disabled={isSubmitting}
								class="block w-full pr-12"
							/>
							<button
								type="button"
								class="absolute inset-y-0 right-0 pr-3 flex items-center"
								onclick={togglePasswordVisibility}
								disabled={isSubmitting}
							>
								{#if showPassword}
									<EyeSlashSolid class="w-5 h-5 text-gray-400 hover:text-gray-600" />
								{:else}
									<EyeSolid class="w-5 h-5 text-gray-400 hover:text-gray-600" />
								{/if}
							</button>
						</div>
					</div>

					<!-- Скрытое поле для remember_me (всегда false) -->
					<input type="hidden" name="remember_me" value="false" />

					<Button
						type="submit"
						class="w-full !py-3"
						disabled={isSubmitting}
						color="primary"
						size="lg"
					>
						{#if isSubmitting}
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
									 viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Вход...
						{:else}
							Войти в систему
						{/if}
					</Button>
				</form>
			</Card>
		</div>
	</div>

	<!-- Right side - Brand/Image -->
	<div
		class="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
		<div class="flex items-center justify-center w-full">
			<div class="text-center max-w-md">
				<div
					class="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
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