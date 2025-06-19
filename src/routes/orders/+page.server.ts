import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth-middleware.js';

// Моковые данные заказов для демонстрации
const mockOrders = [
	{
		id: '1',
		number: 'ORD-001',
		customer: 'ООО "Рога и копыта"',
		amount: 125000,
		status: 'active',
		created_at: '2024-01-15T10:30:00Z',
		items_count: 5
	},
	{
		id: '2',
		number: 'ORD-002',
		customer: 'ИП Иванов И.И.',
		amount: 85000,
		status: 'completed',
		created_at: '2024-01-14T15:45:00Z',
		items_count: 3
	},
	{
		id: '3',
		number: 'ORD-003',
		customer: 'ООО "ТехноСтрой"',
		amount: 350000,
		status: 'pending',
		created_at: '2024-01-12T09:15:00Z',
		items_count: 12
	},
	{
		id: '4',
		number: 'ORD-004',
		customer: 'ЗАО "МеталлТорг"',
		amount: 75000,
		status: 'cancelled',
		created_at: '2024-01-10T14:20:00Z',
		items_count: 2
	}
];

export const load: PageServerLoad = async (event) => {
	const user = requireAuth(event);

	return {
		user,
		orders: mockOrders
	};
};