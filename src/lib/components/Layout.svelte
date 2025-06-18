<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import Header from './Header.svelte';
	import type { User } from '$lib/types/api.js';

	interface Props {
		user: User;
		title?: string;
		children: import('svelte').Snippet;
	}

	let { user, title, children }: Props = $props();
	let sidebarOpen = $state(false);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
	<Header {user} {title} onToggleSidebar={toggleSidebar} />

	<main class="p-4 sm:ml-64 mt-16">
		<div class="max-w-7xl mx-auto">
			{@render children()}
		</div>
	</main>
</div>