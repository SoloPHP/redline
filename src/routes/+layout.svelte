<script lang="ts">
	import '../app.css';
	import { user, isLoggedIn, checkAuthStatus } from '$lib/stores/auth.js';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	interface Props {
		children: import('svelte').Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	// Синхронизируем данные пользователя из сервера со store
	$effect(() => {
		if (data.user) {
			user.set(data.user);
			isLoggedIn.set(true);
		} else {
			user.set(null);
			isLoggedIn.set(false);
		}
	});

	onMount(() => {
		// Проверяем статус авторизации при загрузке
		checkAuthStatus();
	});
</script>

{@render children()}