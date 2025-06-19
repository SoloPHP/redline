// src/lib/stores/auth.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from '$lib/types/api.js';

interface AuthState {
	user: User | null;
	isLoggedIn: boolean;
	isLoading: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		isLoggedIn: false,
		isLoading: true
	});

	return {
		subscribe,
		setUser: (user: User | null) => {
			set({
				user,
				isLoggedIn: !!user,
				isLoading: false
			});
		},
		setLoading: (isLoading: boolean) => {
			update(state => ({ ...state, isLoading }));
		},
		logout: () => {
			set({
				user: null,
				isLoggedIn: false,
				isLoading: false
			});
		},
		checkClientAuth: () => {
			if (!browser) return;

			const loggedIn = document.cookie
				.split('; ')
				.find(row => row.startsWith('logged_in='))
				?.split('=')[1] === 'true';

			update(state => ({
				...state,
				isLoggedIn: loggedIn,
				isLoading: false
			}));
		}
	};
}

export const auth = createAuthStore();