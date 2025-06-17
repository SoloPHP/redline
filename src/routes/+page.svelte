<script>
	import { Button, Card, Alert } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';
</script>

<div class="container mx-auto p-8">
	<Card class="max-w-md mx-auto">
		<Alert color="blue">
			<InfoCircleOutline slot="icon" class="w-4 h-4" />
			<span class="font-medium">Успех!</span>
			SvelteKit + Tailwind v4 + Flowbite настроены
		</Alert>

		<h1 class="text-3xl font-bold text-center mb-4">
			Проект готов! 🚀
		</h1>

		<Button class="w-full">
			Супер кнопка Flowbite
		</Button>
	</Card>
</div>