<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
</script>

<svelte:head>
	<title>Redline</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
	<div class="text-center">
		<Spinner size="8" />
		<p class="mt-4 text-gray-600 dark:text-gray-400">Перенаправление...</p>
	</div>
</div>