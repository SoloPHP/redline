<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import {
		HomeOutline,
		ShoppingBagOutline,
		UserCircleOutline,
		CogOutline,
		ChartOutline
	} from 'flowbite-svelte-icons';
	import type { Component } from 'svelte';

	interface NavItem {
		label: string;
		href: string;
		icon: Component;
	}

	interface Props {
		isOpen?: boolean;
		onClose?: () => void;
	}

	let { isOpen = false, onClose }: Props = $props();

	const navItems: NavItem[] = [
		{ label: 'Dashboard', href: '/dashboard', icon: HomeOutline },
		{ label: 'Заказы', href: '/orders', icon: ShoppingBagOutline },
		{ label: 'Аналитика', href: '/analytics', icon: ChartOutline },
		{ label: 'Профиль', href: '/profile', icon: UserCircleOutline },
		{ label: 'Настройки', href: '/settings', icon: CogOutline },
	];

	function isActive(href: string): boolean {
		return page.url.pathname === href;
	}

	function handleNavClick(href: string) {
		goto(href);
		// Закрываем сайдбар на мобильных устройствах после навигации
		if (onClose) {
			onClose();
		}
	}

	function handleBackdropClick() {
		if (onClose) {
			onClose();
		}
	}
</script>

<!-- Mobile backdrop -->
{#if isOpen}
	<button
		type="button"
		class="fixed inset-0 z-30 bg-gray-900/50 sm:hidden"
		onclick={handleBackdropClick}
		aria-label="Close sidebar"
	></button>
{/if}

<aside class="fixed left-0 top-0 z-40 w-64 h-screen transition-transform {isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
	<div class="h-full px-3 py-4 overflow-y-auto">
		<!-- Logo -->
		<div class="flex items-center mb-8 px-3">
			<div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
				<span class="text-white font-bold text-lg">R</span>
			</div>
			<span class="ml-3 text-xl font-semibold text-gray-900 dark:text-white">Redline</span>
		</div>

		<!-- Navigation -->
		<ul class="space-y-2 font-medium">
			{#each navItems as item (item.href)}
				{@const IconComponent = item.icon}
				<li>
					<button
						onclick={() => handleNavClick(item.href)}
						class="flex items-center w-full p-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors
							{isActive(item.href) ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : ''}"
					>
						<IconComponent
							class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white
								{isActive(item.href) ? 'text-primary-700 dark:text-primary-400' : ''}"
						/>
						<span class="ml-3">{item.label}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</aside>