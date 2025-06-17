<script lang="ts">
	import { Button, Card, Input, Label, Alert } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		EyeSolid,
		EyeSlashSolid
	} from 'flowbite-svelte-icons';
	import { login } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';

	let loginForm = {
		login: '',
		password: ''
	};

	let loading = false;
	let error = '';
	let showPassword = false;

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!loginForm.login || !loginForm.password) {
			error = 'Пожалуйста, заполните все поля';
			return;
		}

		loading = true;
		error = '';

		try {
			const result = await login(loginForm);

			if (result.success) {
				await goto('/dashboard'); // или куда нужно перенаправить после логина
			} else {
				error = result.error || 'Ошибка авторизации';
			}
		} catch (err) {
			error = 'Произошла ошибка сети';
		} finally {
			loading = false;
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Авторизация - Redline</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
				Вход в систему
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
				Введите ваши учетные данные
			</p>
		</div>

		<Card class="p-6">
			{#if error}
				<Alert color="red" class="mb-4">
					<InfoCircleSolid slot="icon" class="w-4 h-4" />
					<span class="font-medium">Ошибка!</span>
					{error}
				</Alert>
			{/if}

			<form onsubmit={handleSubmit} class="space-y-6">
				<div>
					<Label for="login" class="mb-2">Логин</Label>
					<Input
						id="login"
						name="login"
						type="text"
						autocomplete="username"
						required
						placeholder="Введите ваш логин"
						bind:value={loginForm.login}
						disabled={loading}
					/>
				</div>

				<div>
					<Label for="password" class="mb-2">Пароль</Label>
					<div class="relative">
						<Input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							required
							placeholder="Введите ваш пароль"
							bind:value={loginForm.password}
							disabled={loading}
							class="pr-10"
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-0 pr-3 flex items-center"
							onclick={togglePasswordVisibility}
							disabled={loading}
						>
							{#if showPassword}
								<EyeSlashSolid class="w-5 h-5 text-gray-400" />
							{:else}
								<EyeSolid class="w-5 h-5 text-gray-400" />
							{/if}
						</button>
					</div>
				</div>

				<div>
					<Button
						type="submit"
						class="w-full"
						disabled={loading}
						color="primary"
					>
						{#if loading}
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Вход...
						{:else}
							Войти
						{/if}
					</Button>
				</div>
			</form>
		</Card>
	</div>
</div>