<script lang="ts">
	import type { PageData } from './$types';
	import {
		Autocomplete,
		ProgressRadial,
		RangeSlider,
		Step,
		Stepper,
		popup
	} from '@skeletonlabs/skeleton';
	import type { AutocompleteOption, PopupSettings } from '@skeletonlabs/skeleton';
	import DogCard from '$lib/components/DogCard.svelte';
	import Icon from '@iconify/svelte';
	import DogImage from '$lib/assets/doggo.jpg';
	import { favoriteDogs, syncFavoriteDogs, fetchMatchedDogId, dogIsAFavoriteDog } from '$lib/utils';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import FullscreenConfetti from '$lib/components/FullscreenConfetti.svelte';
	import { searchDogs, fetchNextDogs, fetchDogs } from '$lib/utils';

	export let data: PageData;

	if (data.favoriteDogs) $favoriteDogs = data.favoriteDogs;

	let inputBreed: string = '';
	let selectedBreeds: string[] = [];
	let allDogs: Dog[] = [];
	let size: number = 50;
	let nextPaginationQuery: string = '';
	let sortAscending: boolean = true;
	let maxAge: number = 25;
	let zipcode: string = '';
	let searchMessage: string = 'Search for results.';
	let matchedDog: Promise<Dog>;
	let forceStepRerender: boolean = false; // Toggle to force <Stepper /> to rerender
	let paginationSettings = {
		page: 0,
		limit: size / 2,
		size: 0,
		amounts: [0]
	} satisfies PaginationSettings;
	let currentPage: number = 0;
	let isSearching: boolean = false; // Used to display spinner while fetching for dogs

	$: paginatedSource = allDogs.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);
	$: showAlert = zipcode.length != 0 && zipcode.length < 5;

	const breedOptions: AutocompleteOption<string>[] = data.breeds
		? data.breeds.map((breed) => ({
				label: breed,
				value: breed
		  }))
		: [];

	const popupAge: PopupSettings = {
		event: 'click',
		target: 'popupAge',
		placement: 'bottom'
	};

	const onBreedSelection = (event: CustomEvent<AutocompleteOption<string>>) => {
		selectedBreeds = [...selectedBreeds, event.detail.label];
		handleSearchDogs();
	};

	const toggleSort = () => {
		sortAscending = !sortAscending;
		handleSearchDogs();
	};

	const removeChip = (breedName: string) => {
		selectedBreeds = selectedBreeds.filter((name) => name !== breedName);
		handleSearchDogs();
	};

	const handleZipcodeInput = (event: Event) => {
		const inputEvent = event as Event & { target: HTMLInputElement };
		zipcode = inputEvent.target.value.replace(/\D/g, '').slice(0, 5);
	};

	const handleSearchDogs = async () => {
		isSearching = true;
		const data = await searchDogs(sortAscending, maxAge, zipcode, size, selectedBreeds);
		if (data?.next) nextPaginationQuery = data.next;
		if (data?.total) paginationSettings.size = data.total;
		if (data?.total === 0) searchMessage = 'No results found with specified filter.';
		allDogs = data.resultIds.length !== 0 ? await fetchDogs(data.resultIds) : [];
		isSearching = false;
	};

	const handleFetchNext = async () => {
		const data = await fetchNextDogs(nextPaginationQuery);
		if (data?.next) nextPaginationQuery = data.next;
		allDogs = [...allDogs, ...(await fetchDogs(data.resultIds))];
	};

	const getMatchedDogFromFavorites = async (): Promise<Dog> => {
		const listOfFavDogIds = $favoriteDogs
			.filter((dog) => dog.isFavorite === true)
			.map((dog) => dog.id);
		const data = await fetchMatchedDogId(listOfFavDogIds);
		return $favoriteDogs.filter((dog) => dog.id === data.match)[0];
	};

	const onNextStepHandler = (e: {
		detail: { state: { current: number; total: number }; step: number };
	}) => {
		syncFavoriteDogs($favoriteDogs);

		if (e.detail.step == 1) {
			matchedDog = getMatchedDogFromFavorites();
		}
	};

	const onPrevStepHandler = (e: {
		detail: { state: { current: number; total: number }; step: number };
	}) => {
		syncFavoriteDogs($favoriteDogs);
	};

	const onPaginateChange = () => {
		// Don't fetch on back button
		if (paginationSettings.page - currentPage != 1) {
			currentPage = paginationSettings.page;
			return;
		}
		currentPage = paginationSettings.page;
		handleFetchNext();
		syncFavoriteDogs($favoriteDogs);
	};

	const resetData = () => {
		allDogs = [];
		selectedBreeds = [];
		forceStepRerender = !forceStepRerender;
		$favoriteDogs = [];
		paginationSettings.size = 0;
		syncFavoriteDogs($favoriteDogs);
	};
</script>

{#key forceStepRerender}
	<Stepper
		class="m-5"
		buttonCompleteLabel="Adopt Another"
		on:next={onNextStepHandler}
		on:complete={resetData}
		on:back={onPrevStepHandler}
	>
		<Step buttonNextLabel="Confirm Matches →" locked={$favoriteDogs.length == 0}>
			<svelte:fragment slot="header">
				<header class="text-center">
					<h1
						class="mx-auto mb-2 h1 font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500"
					>
						Finding Your New Best Friend Starts with a Fetch
					</h1>
					<img src={DogImage} alt="dog peeking out" class="mx-auto h-60 object-cover" />
				</header>
			</svelte:fragment>
			<section class="mb-10 md:mx-20 sm:mx-10">
				<div class="input-group grid-cols-[1fr_auto_auto] space-x-1">
					<input
						class="input autocomplete py-1 px-3 rounded-lg font-bold text-primary-500"
						type="text"
						placeholder="Search By Dog Breed..."
						bind:value={inputBreed}
					/>
					<button
						class="btn-icon variant-soft-primary rounded-md h-14 w-14"
						on:click={handleSearchDogs}
						><Icon
							icon="material-symbols:search-rounded"
							class="text-4xl text-primary-500"
						/></button
					>

					<button class="btn-icon variant-soft-primary rounded-md h-14 w-14" on:click={toggleSort}>
						{#if sortAscending}
							<Icon icon="fluent:text-sort-ascending-16-filled" class="text-4xl text-primary-500" />
						{:else}
							<Icon
								icon="fluent:text-sort-descending-16-filled"
								class="text-4xl text-primary-500"
							/>
						{/if}
					</button>
				</div>

				<ul class="my-2 space-x-1 space-y-1">
					{#each selectedBreeds as breedName}
						<li class="chip variant-soft hover:variant-filled">
							<button on:click={() => removeChip(breedName)}
								><Icon icon="material-symbols:close-rounded" /></button
							>
							<span>{breedName}</span>
						</li>
					{/each}
				</ul>

				<section class="card max-h-48 p-4 overflow-y-auto">
					<Autocomplete
						bind:input={inputBreed}
						options={breedOptions}
						on:selection={onBreedSelection}
						denylist={selectedBreeds}
					/>
				</section>

				<div class="flex space-x-1 py-4 items-center justify-start overflow-x-auto overflow-hidden">
					<div
						class="input-group input-group-divider grid-cols-[1fr_auto] h-8 rounded-full flex items-center flex-shrink-0 w-36"
					>
						<div class="input-group-shim h-full"><Icon icon="tabler:zip"></Icon></div>
						<input
							bind:value={zipcode}
							on:input={handleZipcodeInput}
							inputmode="numeric"
							placeholder="Zipcode"
							class="p-2 w-full"
							pattern="\d{5}"
							maxlength="5"
						/>
					</div>
					<button class="btn variant-ghost-surface h-8 w-36 rounded-full" use:popup={popupAge}>
						<span>
							<Icon icon="iconamoon:clock-bold" class="text-primary" />
						</span>
						<span>Max Age: {maxAge}yr</span>
					</button>
				</div>
				<div class="card p-4 w-72 shadow-xl z-10" data-popup="popupAge">
					<RangeSlider name="range-slider" bind:value={maxAge} max={25} step={1} min={1} ticked>
						<div class="flex justify-between items-center">
							<div class="font-bold">Max Age</div>
							<div class="text-md">{maxAge} years</div>
						</div>
					</RangeSlider>
					<div class="arrow bg-surface-100-800-token" />
				</div>
				{#if showAlert}
					<aside class="alert variant-soft">
						<Icon icon="icon-park-solid:caution" class="h3 mx-5" />
						<div class="alert-message">
							<h3 class="h3">Warning</h3>
							<p>Zipcode filter will not applied. Zipcodes should be 5 digit length.</p>
						</div>
						<div class="alert-actions">
							<button
								class="btn variant-outline"
								on:click={() => {
									showAlert = false;
								}}
							>
								<span>
									<Icon icon="material-symbols:close" class="mx-1" />
								</span>
								Dismiss
							</button>
						</div>
					</aside>
				{/if}
			</section>

			{#if isSearching}
				<p class="h2 flex items-center justify-center font-semibold text-primary-400 h-60 gap-5">
					<ProgressRadial width="w-10" /> Fetching results ...
				</p>
			{:else if paginatedSource.length}
				<ul
					class="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center"
				>
					{#each paginatedSource as dogObject (dogObject.id)}
						<DogCard
							id={dogObject.id}
							name={dogObject.name}
							img={dogObject.img}
							age={dogObject.age}
							zip_code={dogObject.zip_code}
							breed={dogObject.zip_code}
							isFavorite={dogIsAFavoriteDog($favoriteDogs, dogObject)}
						/>
					{/each}
				</ul>
			{:else}
				<p class="h2 flex items-center justify-center font-semibold text-primary-400 h-60">
					{searchMessage}
				</p>
			{/if}

			<div class="flex items-center justify-center">
				<Paginator
					bind:settings={paginationSettings}
					on:page={onPaginateChange}
					showFirstLastButtons={false}
					showPreviousNextButtons={true}
					select="hidden"
				/>
			</div>
		</Step>
		<Step buttonNextLabel="Match →" locked={!$favoriteDogs.some((dog) => dog.isFavorite)}>
			<svelte:fragment slot="header"
				><header class="text-center mt-10 sm:mt-5">
					<h1
						class="mx-auto mb-10 h1 font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500"
					>
						Your Favorite Dogs
					</h1>
				</header>
			</svelte:fragment>

			{#if $favoriteDogs.length}
				<ul
					class="max-w-screen-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center mx-5 md:mx-10 lg:mx-20"
				>
					{#each $favoriteDogs as dogObject (dogObject.id)}
						<DogCard
							id={dogObject.id}
							name={dogObject.name}
							img={dogObject.img}
							age={dogObject.age}
							zip_code={dogObject.zip_code}
							breed={dogObject.zip_code}
							isFavorite={dogIsAFavoriteDog($favoriteDogs, dogObject)}
							inConfirmationStep={true}
						/>
					{/each}
				</ul>
			{:else}
				<p class="h2 flex items-center justify-center font-semibold text-primary-400 h-60">
					Add at least one dog to match.
				</p>
			{/if}
		</Step>
		<Step regionHeader="hidden">
			{#await matchedDog}
				<header class="text-center mt-10 sm:mt-5">
					<h1
						class="mx-auto mb-2 h1 font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500 flex items-center justify-center gap-5"
					>
						<ProgressRadial width="w-10" /> Fetching your match
					</h1>
				</header>
			{:then dogObject}
				<FullscreenConfetti />
				<header class="text-center mt-10 sm:mt-5">
					<h1
						class="mx-auto mb-2 h1 font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500"
					>
						Congrats! <br /> You've Matched With {dogObject?.name}.
					</h1>
				</header>
				<ul class="grid grid-cols-1">
					{#if dogObject}
						<DogCard
							id={dogObject.id}
							name={dogObject.name}
							img={dogObject.img}
							age={dogObject.age}
							zip_code={dogObject.zip_code}
							breed={dogObject.zip_code}
							isFavorite={dogIsAFavoriteDog($favoriteDogs, dogObject)}
							showButtons={false}
						/>
					{/if}
				</ul>
			{:catch _}
				<header class="text-center mt-10 sm:mt-5">
					<h1
						class="mx-auto mb-2 h1 font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500 flex justify-between items-center"
					>
						There was an issue with our server. Please try again later.
					</h1>
				</header>
			{/await}
		</Step>
	</Stepper>
{/key}
