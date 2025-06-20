<script lang="ts">
	import { Button, Dropdown, DropdownItem, Avatar } from 'flowbite-svelte';
	import {
		MoonOutline,
		SunOutline,
		ChevronDownOutline,
		UserCircleOutline,
		ArrowRightToBracketOutline,
		CogOutline
	} from 'flowbite-svelte-icons';
	import { theme } from '$lib/stores/theme.js';
	import { enhance } from '$app/forms';
	import type { User } from '$lib/types/api.js';

	interface Props {
		user: User;
		title?: string;
		onToggleSidebar?: () => void;
	}

	let { user, title = 'Dashboard', onToggleSidebar }: Props = $props();
	let isLoggingOut = $state(false);

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

				<!-- User menu -->
				<div class="relative">
					<Button color="alternative" class="flex items-center space-x-2 !px-3 !py-2">
						<Avatar size="sm" src="" class="!w-8 !h-8">
							<UserCircleOutline class="w-8 h-8 text-gray-400" />
						</Avatar>
						<span class="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">
							{user.login}
						</span>
						<ChevronDownOutline class="w-4 h-4" />
					</Button>

					<Dropdown class="w-56 p-2 shadow-xl border-0 bg-white dark:bg-gray-800 rounded-xl">
						<!-- User info section -->
						<div class="px-3 py-3 border-b border-gray-100 dark:border-gray-700">
							<div class="flex items-center space-x-3">
								<Avatar size="sm" src="" class="!w-10 !h-10">
									<UserCircleOutline class="w-10 h-10 text-gray-400" />
								</Avatar>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
										{user.login}
									</p>
									<p class="text-xs text-gray-500 dark:text-gray-400 truncate">
										{user.email || 'Пользователь'}
									</p>
								</div>
							</div>
						</div>

						<!-- Menu items -->
						<div class="py-2">
							<DropdownItem class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
								<UserCircleOutline class="w-4 h-4 text-gray-500 dark:text-gray-400" />
								<span>Мой профиль</span>
							</DropdownItem>

							<DropdownItem class="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
								<CogOutline class="w-4 h-4 text-gray-500 dark:text-gray-400" />
								<span>Настройки</span>
							</DropdownItem>
						</div>

						<!-- Logout section -->
						<div class="border-t border-gray-100 dark:border-gray-700 pt-2">
							<form
								method="POST"
								action="/logout"
								use:enhance={() => {
									isLoggingOut = true;
									return async ({ update }) => {
										await update();
									};
								}}
								class="block"
							>
								<button
									type="submit"
									disabled={isLoggingOut}
									class="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
								>
									<ArrowRightToBracketOutline class="w-4 h-4" />
									<span>{isLoggingOut ? 'Выход...' : 'Выйти из системы'}</span>
								</button>
							</form>
						</div>
					</Dropdown>
				</div>
			</div>
		</div>
	</div>
</header>