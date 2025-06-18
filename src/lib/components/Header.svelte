<script lang="ts">
	import { Button, Dropdown, DropdownItem, Avatar } from 'flowbite-svelte';
	import {
		MoonOutline,
		SunOutline,
		BellOutline,
		ChevronDownOutline,
		UserCircleOutline,
		ArrowRightToBracketOutline,
		CogOutline
	} from 'flowbite-svelte-icons';
	import { theme } from '$lib/stores/theme.js';
	import { logout } from '$lib/stores/auth.js';
	import type { User } from '$lib/types/api.js';

	interface Props {
		user: User;
		title?: string;
		onToggleSidebar?: () => void;
	}

	let { user, title = 'Dashboard', onToggleSidebar }: Props = $props();

	async function handleLogout() {
		await logout();
	}

	function toggleTheme() {
		theme.toggle();
	}

	function handleSidebarToggle() {
		if (onToggleSidebar) {
			onToggleSidebar();
		}
	}
</script>

<header class="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sm:ml-64">
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center justify-start">
				<!-- Mobile menu button -->
				<button
					onclick={handleSidebarToggle}
					class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				>
					<span class="sr-only">Open sidebar</span>
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clip-rule="evenodd" />
					</svg>
				</button>

				<!-- Page title -->
				<h1 class="ml-3 text-xl font-semibold text-gray-900 dark:text-white sm:ml-0">
					{title}
				</h1>
			</div>

			<div class="flex items-center space-x-3">
				<!-- Theme toggle -->
				<Button
					onclick={toggleTheme}
					color="alternative"
					size="sm"
					class="!p-2"
				>
					{#if $theme === 'dark'}
						<SunOutline class="w-5 h-5" />
					{:else}
						<MoonOutline class="w-5 h-5" />
					{/if}
				</Button>

				<!-- Notifications -->
				<Button color="alternative" size="sm" class="!p-2 relative">
					<BellOutline class="w-5 h-5" />
					<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
				</Button>

				<!-- User menu -->
				<div class="relative">
					<Button color="alternative" class="flex items-center space-x-2 !px-3">
						<Avatar size="sm" src="" class="!w-7 !h-7">
							<UserCircleOutline class="w-7 h-7 text-gray-400" />
						</Avatar>
						<span class="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
							{user.login}
						</span>
						<ChevronDownOutline class="w-4 h-4" />
					</Button>

					<Dropdown class="w-44">
						<DropdownItem class="flex items-center space-x-2">
							<UserCircleOutline class="w-4 h-4" />
							<span>Профиль</span>
						</DropdownItem>
						<DropdownItem class="flex items-center space-x-2">
							<CogOutline class="w-4 h-4" />
							<span>Настройки</span>
						</DropdownItem>
						<hr class="my-1">
						<DropdownItem onclick={handleLogout} class="flex items-center space-x-2 text-red-600 dark:text-red-400">
							<ArrowRightToBracketOutline class="w-4 h-4" />
							<span>Выйти</span>
						</DropdownItem>
					</Dropdown>
				</div>
			</div>
		</div>
	</div>
</header>