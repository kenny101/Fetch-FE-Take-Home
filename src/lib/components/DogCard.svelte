<script lang="ts">
    import Icon from "@iconify/svelte";
	import { favoriteDogs, removedDogs } from "$lib/user";

	export let dogObject: Dog;
	export let favorite:boolean;

	let {name, img, age, zip_code, breed, id} = dogObject;
	let inConfirmationStep = false;

	if (favorite) {
		inConfirmationStep = true;
	}

	function toggleFavorite() {
    	favorite = !favorite;
		
		if (inConfirmationStep) {
			if (!favorite) {
				$removedDogs = [...$removedDogs, dogObject];
			}else{
				$removedDogs = $removedDogs.filter((dogObject) => dogObject.id !== id);
			}
			console.log("removed dogs:", $removedDogs)
			return;
		}

		if (favorite) {
			$favoriteDogs = [...$favoriteDogs, dogObject];
			
		} else {
			$favoriteDogs = $favoriteDogs.filter((dogObject) => dogObject.id !== id);
		}
		console.log("favorites:", $favoriteDogs);
	}
</script>

<div class="max-w-xs mx-auto mb-5 space-y-2">
	<header class="text-center relative">
		<button on:click={toggleFavorite}
			><img
				src={img}
				alt={`${breed}`}
				class="rounded-md w-60 h-60 object-cover gradient-mask-b-60 hover:cursor-pointer"
			/>
		</button>

		<div class="absolute bottom-3 left-3">
			{#if favorite}
				<button class="btn-icon variant-filled" on:click={toggleFavorite}>
					<Icon icon="noto:red-heart" class="text-error-500 text-3xl" />
				</button>
			{:else}
				<button class="btn-icon variant-filled-primary" on:click={toggleFavorite}>
					<Icon icon="noto:broken-heart" class="text-grey-300 text-3xl" />
				</button>
			{/if}
		</div>
	</header>
	<section class="text-center">
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
