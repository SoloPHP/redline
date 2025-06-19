<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme.js';
	import { auth } from '$lib/stores/auth.js';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types/api.js';

	interface Props {
		data: { user?: User | null };
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	onMount(() => {
		theme.init();

		// Инициализируем auth store данными с сервера
		auth.setUser(data.user || null);

		// Также проверяем клиентские куки для реактивности
		auth.checkClientAuth();
	});

	// Обновляем store при изменении данных сервера
	$effect(() => {
		auth.setUser(data.user || null);
	});
</script>

{@render children()}