// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { User } from '$lib/types/api';

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
		}

		interface Locals {
			user: User | null;
		}

		interface PageData {
			user?: User | null;
		}

		// interface PageState {}
		// interface Platform {}
	}
}

export {};