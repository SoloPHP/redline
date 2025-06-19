<script lang="ts">
	import { Button, Card, Badge, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell, Input } from 'flowbite-svelte';
	import {
		EyeOutline,
		SearchOutline,
		PlusOutline,
		FilterOutline
	} from 'flowbite-svelte-icons';
	import Layout from '$lib/components/Layout.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let searchQuery = $state('');

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB'
		}).format(amount);
	}

	function formatDate(dateString: string): string {
		return new Intl.DateTimeFormat('ru-RU', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(dateString));
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'active': return 'blue';
			case 'completed': return 'green';
			case 'pending': return 'yellow';
			case 'cancelled': return 'red';
			default: return 'gray';
		}
	}

	function getStatusText(status: string): string {
		switch (status) {
			case 'active': return 'Активный';
			case 'completed': return 'Завершен';
			case 'pending': return 'В ожидании';
			case 'cancelled': return 'Отменен';
			default: return status;
		}
	}

	const stats = [
		{
			title: 'Всего заказов',
			value: data.orders.length,
			color: 'blue'
		},
		{
			title: 'Завершено',
			value: data.orders.filter(o => o.status === 'completed').length,
			color: 'green'
		},
		{
			title: 'В работе',
			value: data.orders.filter(o => o.status === 'active' || o.status === 'pending').length,
			color: 'yellow'
		},
		{
			title: 'Общая сумма',
			value: formatCurrency(data.orders.reduce((sum, order) => sum + order.amount, 0)),
			color: 'purple'
		}
	];

	function getStatColorClasses(color: string) {
		const colors = {
			blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
			green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
			yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
			purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
		};
		return colors[color] || colors.blue;
	}
</script>

<svelte:head>
	<title>Заказы - Redline</title>
</svelte:head>

<Layout user={data.user} title="Заказы">
	<div class="space-y-6">
		<!-- Stats Cards -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each stats as stat (stat.title)}
				<Card class="p-6 border {getStatColorClasses(stat.color)} shadow-sm">
					<div class="text-center">
						<p class="text-2xl font-bold text-gray-900 dark:text-white">
							{typeof stat.value === 'number' ? stat.value : stat.value}
						</p>
						<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
							{stat.title}
						</p>
					</div>
				</Card>
			{/each}
		</div>

		<!-- Orders Table -->
		<Card class="border-0 shadow-sm">
			<div class="p-6">
				<!-- Header -->
				<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<h3 class="text-xl font-semibold text-gray-900 dark:text-white">
						Список заказов
					</h3>
					<div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
						<!-- Search -->
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<SearchOutline class="w-5 h-5 text-gray-400" />
							</div>
							<Input
								placeholder="Поиск заказов..."
								bind:value={searchQuery}
								class="pl-10 w-full sm:w-64"
							/>
						</div>
						<!-- Buttons -->
						<div class="flex gap-2">
							<Button color="alternative" size="sm">
								<FilterOutline class="w-4 h-4 mr-2" />
								Фильтр
							</Button>
							<Button color="primary" size="sm">
								<PlusOutline class="w-4 h-4 mr-2" />
								Создать заказ
							</Button>
						</div>
					</div>
				</div>

				<!-- Table -->
				<div class="overflow-x-auto">
					<Table class="min-w-full">
						<TableHead>
							<TableHeadCell class="!px-6 !py-3">Номер заказа</TableHeadCell>
							<TableHeadCell class="!px-6 !py-3">Клиент</TableHeadCell>
							<TableHeadCell class="!px-6 !py-3">Сумма</TableHeadCell>
							<TableHeadCell class="!px-6 !py-3">Статус</TableHeadCell>
							<TableHeadCell class="!px-6 !py-3">Товаров</TableHeadCell>
							<TableHeadCell class="!px-6 !py-3">Дата</TableHeadCell>
							<TableHeadCell class="!px-6 !py-3">Действия</TableHeadCell>
						</TableHead>
						<TableBody>
							{#each data.orders as order (order.id)}
								<TableBodyRow class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
									<TableBodyCell class="!px-6 !py-4">
										<span class="font-semibold text-gray-900 dark:text-white">
											{order.number}
										</span>
									</TableBodyCell>
									<TableBodyCell class="!px-6 !py-4">
										<div class="text-gray-900 dark:text-white">
											{order.customer}
										</div>
									</TableBodyCell>
									<TableBodyCell class="!px-6 !py-4">
										<span class="font-semibold text-gray-900 dark:text-white">
											{formatCurrency(order.amount)}
										</span>
									</TableBodyCell>
									<TableBodyCell class="!px-6 !py-4">
										<Badge color={getStatusColor(order.status)} class="font-medium">
											{getStatusText(order.status)}
										</Badge>
									</TableBodyCell>
									<TableBodyCell class="!px-6 !py-4">
										<span class="text-gray-900 dark:text-white">
											{order.items_count}
										</span>
									</TableBodyCell>
									<TableBodyCell class="!px-6 !py-4">
										<span class="text-gray-500 dark:text-gray-400">
											{formatDate(order.created_at)}
										</span>
									</TableBodyCell>
									<TableBodyCell class="!px-6 !py-4">
										<Button color="alternative" size="xs" class="!px-3 !py-1.5">
											<EyeOutline class="w-3 h-3 mr-1" />
											Просмотр
										</Button>
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			</div>
		</Card>
	</div>
</Layout>