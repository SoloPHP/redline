<script lang="ts">
	import { Card, Alert } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		UserCircleSolid,
		ShoppingBagOutline,
		ChartOutline,
		ArrowUpOutline
	} from 'flowbite-svelte-icons';
	import Layout from '$lib/components/Layout.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const stats = [
		{
			title: 'Общая выручка',
			value: '₽2,534,720',
			change: '+12.5%',
			changeType: 'increase',
			icon: ChartOutline,
			color: 'blue'
		},
		{
			title: 'Заказы',
			value: '1,234',
			change: '+8.2%',
			changeType: 'increase',
			icon: ShoppingBagOutline,
			color: 'green'
		},
		{
			title: 'Клиенты',
			value: '892',
			change: '+5.1%',
			changeType: 'increase',
			icon: UserCircleSolid,
			color: 'purple'
		},
		{
			title: 'Средний чек',
			value: '₽12,450',
			change: '+2.3%',
			changeType: 'increase',
			icon: ArrowUpOutline,
			color: 'orange'
		}
	];

	function getStatColorClasses(color: string) {
		const colors = {
			blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
			green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
			purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
			orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
		};
		return colors[color] || colors.blue;
	}
</script>

<svelte:head>
	<title>Dashboard - Redline</title>
</svelte:head>

<Layout user={data.user} title="Dashboard">
	<div class="space-y-6">
		<!-- Welcome Alert -->
		<Alert color="green" class="border-0 shadow-sm">
			<InfoCircleSolid slot="icon" class="w-5 h-5" />
			<span class="font-medium">Добро пожаловать, {data.user?.login}!</span>
			Вы успешно авторизовались в системе
		</Alert>

		<!-- Stats Grid -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each stats as stat}
				<Card class="p-6 hover:shadow-lg transition-shadow border-0 shadow-sm">
					<div class="flex items-center">
						<div class="flex-shrink-0">
							<div class="w-12 h-12 rounded-xl flex items-center justify-center {getStatColorClasses(stat.color)}">
								<svelte:component this={stat.icon} class="w-6 h-6" />
							</div>
						</div>
						<div class="ml-4 flex-1">
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">
								{stat.title}
							</p>
							<div class="flex items-baseline">
								<p class="text-2xl font-semibold text-gray-900 dark:text-white">
									{stat.value}
								</p>
								<p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
									<ArrowUpOutline class="w-3 h-3 mr-1" />
									{stat.change}
								</p>
							</div>
						</div>
					</div>
				</Card>
			{/each}
		</div>

		<!-- Main Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Recent Activity -->
			<div class="lg:col-span-2">
				<Card class="p-6 border-0 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Последняя активность
					</h3>
					<div class="space-y-4">
						{#each Array(5) as _, i}
							<div class="flex items-center space-x-4">
								<div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
									<ShoppingBagOutline class="w-5 h-5 text-primary-600 dark:text-primary-400" />
								</div>
								<div class="flex-1">
									<p class="text-sm font-medium text-gray-900 dark:text-white">
										Новый заказ #ORD-{1000 + i}
									</p>
									<p class="text-sm text-gray-500 dark:text-gray-400">
										{['ООО "Рога и копыта"', 'ИП Иванов И.И.', 'ЗАО "ТехноСтрой"', 'ООО "МеталлТорг"', 'ИП Петров П.П.'][i]}
									</p>
								</div>
								<span class="text-sm text-gray-500 dark:text-gray-400">
									{i + 1}ч назад
								</span>
							</div>
						{/each}
					</div>
				</Card>
			</div>

			<!-- Quick Stats -->
			<div class="space-y-6">
				<Card class="p-6 border-0 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Быстрая статистика
					</h3>
					<div class="space-y-4">
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600 dark:text-gray-400">Заказы сегодня</span>
							<span class="text-sm font-semibold text-gray-900 dark:text-white">23</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600 dark:text-gray-400">Выручка сегодня</span>
							<span class="text-sm font-semibold text-gray-900 dark:text-white">₽284,500</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600 dark:text-gray-400">Новые клиенты</span>
							<span class="text-sm font-semibold text-gray-900 dark:text-white">7</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm text-gray-600 dark:text-gray-400">Конверсия</span>
							<span class="text-sm font-semibold text-green-600">+2.4%</span>
						</div>
					</div>
				</Card>

				<Card class="p-6 border-0 shadow-sm">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Топ товары
					</h3>
					<div class="space-y-3">
						{#each ['Товар А', 'Товар Б', 'Товар В'] as product, i}
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
										<span class="text-white text-xs font-bold">{i + 1}</span>
									</div>
									<span class="text-sm font-medium text-gray-900 dark:text-white">{product}</span>
								</div>
								<span class="text-sm text-gray-500 dark:text-gray-400">{150 - i * 20} шт.</span>
							</div>
						{/each}
					</div>
				</Card>
			</div>
		</div>
	</div>
</Layout>