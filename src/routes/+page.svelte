<script lang="ts">
	import type { PageData } from './$types';
	import { Autocomplete, RangeSlider, Step, Stepper, popup } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption, PopupSettings } from '@skeletonlabs/skeleton';
	import DogCard from '$lib/components/DogCard.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Icon from '@iconify/svelte';
	import DogImage from '$lib/assets/doggo.jpg';
	import { favoriteDogs, resetDogStores } from '$lib/user';
	import { Confetti } from 'svelte-confetti';
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let inputBreed: string = '';
	let inputChipList: string[] = [];
	let allDogs: Dog[] = [];
	let size: number = 50;
	let nextPaginationQuery: string = '';
	let totalObjects: number = 0;
	let sortAscending: boolean = true;
	let maxAge: number = 25;
	let zipcode: string = '';
	let showAlert: boolean = false;
	let searchMessage: string = 'Search for results.';
	let matchedDog: Dog = {
		id: '',
		img: '',
		name: '',
		age: 0,
		zip_code: '',
		breed: '',
		isFavorite: false
	};
	let forceStepRerender: boolean = false; // Used to force the stepper to render after completing stepper

	let paginationSettings = {
		page: 0,
		limit: size / 2,
		size: totalObjects,
		amounts: [allDogs.length]
	} satisfies PaginationSettings;

	$: paginationSettings.size = totalObjects;
	$: paginationSettings.page = 0;
	$: paginatedSource = allDogs.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);

	const breedOptions: AutocompleteOption<string>[] | undefined = data.breeds?.map((breed) => ({
		label: breed,
		value: breed
	}));

	const popupAge: PopupSettings = {
		event: 'click',
		target: 'popupAge',
		placement: 'bottom'
	};

	function onBreedSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		inputChipList = [...inputChipList, event.detail.label];
	}

	function toggleSort() {
		sortAscending = !sortAscending;
		searchDogs();
	}

	function removeChip(breedName: string): void {
		inputChipList = inputChipList.filter((name) => name !== breedName);
	}

	function handleInput(event: Event) {
		const inputEvent = event as Event & { target: HTMLInputElement };
		zipcode = inputEvent.target.value.replace(/\D/g, '').slice(0, 5);
	}

	const searchDogs = async () => {
		try {
			const sortBreedParam = sortAscending ? '&sort=breed:asc' : '&sort=breed:desc';
			const maxAgeParam = maxAge ? `&ageMax=${maxAge}` : '';
			const zipcodeParam = zipcode.length != 0 && zipcode.length == 5 ? `&zipCodes=${zipcode}` : '';
			const sizeParam = size ? `&size=${size}` : '';
			const breedsParams =
				inputChipList.length && inputChipList.length > 0
					? `breeds=${inputChipList.join('&breeds=')}`
					: '';
			showAlert = zipcode.length != 0 && zipcode.length < 5;

			let queryUrl = `${PUBLIC_API_URL}/dogs/search?${breedsParams}${sortBreedParam}${maxAgeParam}${zipcodeParam}${sizeParam}`;

			const response = await fetch(queryUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) goto('/login');

			const data = await response.json();
			if (data.total == 0) searchMessage = 'No results found with specified filter.';
			if (data.total) totalObjects = data.total;
			if (data.next) nextPaginationQuery = data.next;

			getDogs(data.resultIds, true);
			paginationSettings.page = 0;
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const fetchNext = async () => {
		try {
			const queryUrl = `${PUBLIC_API_URL}${nextPaginationQuery}`;
			const response = await fetch(queryUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) goto('/login');

			const data = await response.json();
			if (data.next) nextPaginationQuery = data.next;
			getDogs(data.resultIds, false);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const getDogs = async (listOfDogIds: string[], clearData: boolean) => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/dogs`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(listOfDogIds)
			});

			if (!response.ok) goto('/login');
			const data: Dog[] = addMatchedFlag(await response.json());

			if (clearData) {
				allDogs = data;
			} else {
				allDogs = [...allDogs, ...data];
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const getMatch = async (listOfDogIds: string[]) => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/dogs/match`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(listOfDogIds)
			});

			if (!response.ok) goto('/login');
			const data: Match = await response.json();
			const dogMatchId: string = data.match;
			return dogMatchId;
		} catch (error) {
			console.error('Error:', error);
		}

		return '';
	};

	async function matchDog() {
		const favoriteDogsIds = $favoriteDogs
			.filter((dog) => dog.isFavorite === true)
			.map((dog) => dog.id);
		const dogIdMatch = await getMatch(favoriteDogsIds);
		matchedDog = $favoriteDogs.filter((dog) => dog.id === dogIdMatch)[0];
	}

	async function onNextHandler(e: {
		detail: { state: { current: number; total: number }; step: number };
	}) {
		if (e.detail.step == 1) {
			await matchDog();
		}
	}

	function resetData() {
		allDogs = [];
		inputChipList = [];
		forceStepRerender = !forceStepRerender;
		resetDogStores();
	}

	function addMatchedFlag(dogsList: Dog[]) {
		const updatedWithMatchedFlag = dogsList.map((dog) => ({
			...dog,
			isFavorite: false
		}));
		return updatedWithMatchedFlag;
	}
</script>

<main>
	{#key forceStepRerender}
		<Stepper
			class="m-5"
			buttonCompleteLabel="Adopt Another"
			on:next={onNextHandler}
			on:complete={resetData}
		>
			<Step buttonNextLabel="Confirm Matches →" locked={$favoriteDogs.length == 0}>
				<svelte:fragment slot="header">
					<header class="text-center">
						<h1
							class="mx-auto mb-2 h1 font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500"
						>
							Finding Your New Best Friend Starts With Fetch
						</h1>
						<img src={DogImage} alt="dog peeking out" class="mx-auto h-60 object-cover" />
					</header>
				</svelte:fragment>
				<section class="mb-10 md:mx-20 sm:mx-10">
					<div class="input-group grid-cols-[1fr_auto_auto] space-x-1">
						<input
							class="input autocomplete p-1 rounded-lg font-bold text-primary-500"
							type="text"
							placeholder="Search By Dog Breed..."
							bind:value={inputBreed}
						/>
						<button class="btn-icon variant-soft-primary rounded-md h-14 w-14" on:click={searchDogs}
							><Icon
								icon="material-symbols:search-rounded"
								class="text-4xl text-primary-500"
							/></button
						>

						<button
							class="btn-icon variant-soft-primary rounded-md h-14 w-14"
							on:click={toggleSort}
						>
							{#if sortAscending}
								<Icon
									icon="fluent:text-sort-ascending-16-filled"
									class="text-4xl text-primary-500"
								/>
							{:else}
								<Icon
									icon="fluent:text-sort-descending-16-filled"
									class="text-4xl text-primary-500"
								/>
							{/if}
						</button>
					</div>

					<div class="my-2 space-x-1 space-y-1">
						{#each inputChipList as breedName}
							<button class="chip variant-soft hover:variant-filled">
								<button on:click={() => removeChip(breedName)}
									><Icon icon="material-symbols:close-rounded" /></button
								>
								<span>{breedName}</span>
							</button>
						{/each}
					</div>

					<div class="card max-h-48 p-4 overflow-y-auto">
						<Autocomplete
							bind:input={inputBreed}
							options={breedOptions}
							on:selection={onBreedSelection}
							denylist={inputChipList}
						/>
					</div>
					<div
						class="flex space-x-1 py-4 items-center justify-start overflow-x-auto overflow-hidden"
					>
						<div class="w-36">
							<div
								class="input-group input-group-divider grid-cols-[1fr_auto] h-8 rounded-full flex items-center w-36"
							>
								<div class="input-group-shim h-full"><Icon icon="tabler:zip"></Icon></div>
								<input
									bind:value={zipcode}
									on:input={handleInput}
									inputmode="numeric"
									placeholder="Zipcode"
									class="p-2 w-full"
									pattern="\d{5}"
									maxlength="5"
								/>
							</div>
						</div>
						<button class="btn variant-ghost-surface h-8 w-36 rounded-full" use:popup={popupAge}>
							<span>
								<Icon icon="iconamoon:clock-bold" class="text-primary" />
							</span>
							<span>Max Age: {maxAge}yr</span>
						</button>
					</div>

					{#if showAlert}
						<aside class="alert variant-soft">
							<Icon icon="icon-park-solid:caution" class="h3 mx-5" />
							<div class="alert-message">
								<h3 class="h3">Warning</h3>
								<p>Zipcode filter not applied. Zipcodes should be 5 digit length.</p>
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

					<div class="card p-4 w-72 shadow-xl z-10" data-popup="popupAge">
						<RangeSlider name="range-slider" bind:value={maxAge} max={25} step={1} min={1} ticked>
							<div class="flex justify-between items-center">
								<div class="font-bold">Max Age</div>
								<div class="text-md">{maxAge} years</div>
							</div>
						</RangeSlider>
						<div class="arrow bg-surface-100-800-token" />
					</div>
				</section>

				{#if paginatedSource.length}
					<section
						class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center mx-5 md:mx-10 lg:mx-20"
					>
						{#each paginatedSource as dogObject (dogObject.id)}
							<DogCard {dogObject} />
						{/each}
					</section>
				{:else}
					<p class="h2 flex items-center justify-center font-semibold text-primary-400 h-60">
						{searchMessage}
					</p>
				{/if}

				<div class="flex items-center justify-center">
					<Paginator
						bind:settings={paginationSettings}
						on:page={fetchNext}
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
				<section
					class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center mx-5 md:mx-10 lg:mx-20"
				>
					{#each $favoriteDogs as dogObject}
						<DogCard {dogObject} inConfirmationStep={true} />
					{/each}
				</section>
			</Step>
			<Step>
				<div
					style="
					position: fixed;
					top: -50px;
					left: 0;
					height: 100vh;
					width: 100vw;
					display: flex;
					justify-content: center;
					overflow: hidden;
					pointer-events: none;"
				>
					<Confetti
						x={[-5, 5]}
						y={[0, 0.1]}
						delay={[500, 2000]}
						infinite
						duration={5000}
						amount={200}
						fallDistance="100vh"
					/>
				</div>
				<svelte:fragment slot="header">
					<header class="text-center mt-10 sm:mt-5">
						<h1
							class="mx-auto mb-2 h1 font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500"
						>
							Congrats! <br /> You've Matched With {matchedDog.name}.
						</h1>
					</header>
				</svelte:fragment>
				{#key matchedDog}
					<section class="grid grid-cols-1">
						<DogCard dogObject={matchedDog} showButtons={false} />
					</section>
				{/key}
			</Step>
		</Stepper>
	{/key}
</main>
