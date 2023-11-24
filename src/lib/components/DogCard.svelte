<script lang="ts">
	import Icon from '@iconify/svelte';
	import { favoriteDogs, removedDogs } from '$lib/user';

	export let dogObject: Dog;
	export let favorite: boolean;
	export let showButtons = true;
	export let inConfirmationStep = false;

	let { name, img, age, zip_code, breed, id } = dogObject;

	function toggleFavorite() {
		favorite = !favorite;

		if (inConfirmationStep) {
			if (!favorite) {
				$removedDogs = [...$removedDogs, dogObject];
			} else {
				$removedDogs = $removedDogs.filter((dogObject) => dogObject.id !== id);
			}
			return;
		}

		if (favorite) {
			$favoriteDogs = [...$favoriteDogs, dogObject];
		} else {
			$favoriteDogs = $favoriteDogs.filter((dogObject) => dogObject.id !== id);
		}
	}
</script>

<div class="max-w-xl mx-auto mb-5 space-y-2 shadow-xl rounded-md">
	<header class="text-center relative">
		<button on:click={toggleFavorite}
			><img
				src={img}
				alt={`${breed}`}
				class="rounded-md w-60 h-60 object-cover gradient-mask-b-60 hover:cursor-pointer"
			/>
		</button>

		{#if showButtons}
			<div class="absolute bottom-0 left-3">
				{#if favorite}
					<button class="btn-icon variant-ghost-error" on:click={toggleFavorite}>
						<Icon icon="clarity:heart-solid" class="text-error-500 text-3xl" />
					</button>
				{:else}
					<button class="btn-icon variant-ghost-primary" on:click={toggleFavorite}>
						<Icon icon="clarity:heart-broken-line" class="text-primary-500 text-3xl" />
					</button>
				{/if}
			</div>
		{/if}
	</header>

	<section class="text-center pb-5">
		<h2 class="text-2xl font-semibold">{name}</h2>
		<p class="text-lg text-gray-600 flex items-center justify-center">
			<span class="mx-1"><Icon icon="mdi-paw" /></span>
			{breed}
		</p>
		<div class="text-gray-600 flex items-center justify-center space-x-5">
			<p class="flex items-center justify-evenly">
				<span class="mx-1"><Icon icon="iconamoon:clock-bold" /></span>
				{age}yr.
			</p>
			<p class="flex items-center justify-evenly">
				<span class="mx-1"><Icon icon="tabler:zip" height="25" width="25" /></span>
				{zip_code}
			</p>
		</div>
	</section>
</div>
