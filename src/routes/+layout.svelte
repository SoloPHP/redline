<script lang="ts">
	import '../app.css';
	import { user, isLoggedIn, initAuthState } from '$lib/stores/auth.js';
	import { theme } from '$lib/stores/theme.js';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	interface Props {
		children: import('svelte').Snippet;
		data: LayoutData;
	}

	let { children, data }: Props = $props();

	// Синхронизируем данные пользователя из сервера
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
		// Инициализируем состояние авторизации и темы
		initAuthState();
		theme.init();
	});
</script>

{@render children()}