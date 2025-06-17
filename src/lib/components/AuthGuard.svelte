<script lang="ts">
	import { isLoggedIn } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Spinner } from 'flowbite-svelte';

	interface Props {
		children: import('svelte').Snippet;
		redirectTo?: string;
		requireAuth?: boolean;
		fallback?: import('svelte').Snippet;
	}

	let {
		children,
		redirectTo = '/login',
		requireAuth = true,
		fallback
	}: Props = $props();

	let isLoading = $state(true);
	let shouldRender = $state(false);

	onMount(() => {
		isLoading = false;
	});

	$effect(() => {
		if (!isLoading) {
			if (requireAuth && !$isLoggedIn) {
				goto(redirectTo);
				shouldRender = false;
			} else if (!requireAuth && $isLoggedIn) {
				goto('/dashboard');
				shouldRender = false;
			} else {
				shouldRender = true;
			}
		}
	});
</script>

{#if isLoading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="text-center">
			<Spinner size="8" />
			<p class="mt-4 text-gray-600 dark:text-gray-400">Загрузка...</p>
		</div>
	</div>
{:else if shouldRender}
	{@render children()}
{:else if fallback}
	{@render fallback()}
{/if}