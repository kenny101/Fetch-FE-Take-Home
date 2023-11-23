<script lang="ts">
	import type { PageData } from './$types';
	import { Autocomplete, Step, Stepper } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import DogCard from '$lib/components/DogCard.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Icon from '@iconify/svelte';
	import DogImage from '$lib/assets/doggo.jpg';
	import { favoriteDogs } from '$lib/user';
	import { Confetti } from "svelte-confetti";
	import { Paginator, type PaginationSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	export let data: PageData;
	
	let inputBreed = '';
	let inputChipList: string[] = [];
	let allDogs: Dog[] = [];
	let size = 50;
	let nextPaginationQuery = '';
	let totalObjects = 0;

	let paginationSettings = {
		page: 0,
		limit: size / 2,
		size: totalObjects,
		amounts: [1, 2, 3, 5, allDogs.length]
	} satisfies PaginationSettings;

	$: paginationSettings.size = totalObjects;

	$: paginatedSource = allDogs.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);

	const breedOptions: AutocompleteOption<string>[] | undefined = data.breeds?.map(breed => ({
		label: breed,
		value: breed
  	}));

	function onBreedSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		inputChipList = [...inputChipList, event.detail.label];
	};

	function removeChip(breedName: string): void {
        inputChipList = inputChipList.filter(name => name !== breedName);
    }

	const searchDogs = async () => {
		try {

			let queryUrl = `${PUBLIC_API_URL}/dogs/search`

			if (inputChipList.length) {
				const queryParams = inputChipList.length > 0 ? `?breeds=${inputChipList.join('&breeds=')}` : '';
				const sizeParam = size ? `&size=${size}` : '';
				queryUrl = `${PUBLIC_API_URL}/dogs/search${queryParams}${sizeParam}`;
			}
			
			const response = await fetch(queryUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) goto('/login')
			

			const data = await response.json();
			totalObjects = data.total;
			nextPaginationQuery = data.next;
			getDogs(data.resultIds);
		} catch(error){
			console.error("Error:", error);
		}
	}

	const fetchNext = async () => {
		try {
			const queryUrl = `${PUBLIC_API_URL}${nextPaginationQuery}`;
			const response = await fetch(queryUrl, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (!response.ok) goto('/login')

			const data = await response.json();
			nextPaginationQuery = data.next;
			getDogs(data.resultIds);
		} catch(error){
			console.error("Error:", error);
		}
	}

	const getDogs = async (listOfDogIds: string[]) => {
		try{
			const response = await fetch(`${PUBLIC_API_URL}/dogs`, {
				method: 'POST',
				credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
				body: JSON.stringify(listOfDogIds)
			})

			if (!response.ok) goto('/login')
			const data = await response.json();
			allDogs = [...allDogs, ...data];
		}catch(error){
			console.error("Error:", error);
		}
	}

	let state = {
		firstLast: false,
		previousNext: true
	};

	function onPageChange(e: CustomEvent): void {
		fetchNext();
	}

</script>

<main>
	<Stepper class="mx-10 my-5" buttonCompleteLabel="Adopt Another">
		<Step class="space-y-0" buttonNextLabel="Confirm Matches →">
			<svelte:fragment slot="header"
				><header class="text-center">
					<h1
						class="mx-auto mb-2 text-5xl sm:text-3xl md:text-4xl font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500"
					>
						Finding Your New Best Friend Starts With Fetch
					</h1>
					<img src={DogImage} alt="dog peeking out" class="mx-auto h-60 object-cover" />
				</header>
			</svelte:fragment>
			<section class="mb-10 md:mx-20 sm:mx-10 mx-5">
				<div class="input-group grid-cols-[1fr_auto] p-2 space-x-1">
					<input
						class="input autocomplete p-1 rounded-lg font-bold text-primary-500"
						type="search"
						placeholder="Search By Dog Breed..."
						bind:value={inputBreed}
					/>
					<button
						class="bg-gradient-to-br variant-gradient-primary-secondary rounded-xl"
						on:click={searchDogs}><Icon icon="material-symbols:search-rounded" /></button
					>
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
			</section>

			<section
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center"
			>
				{#each paginatedSource as dogObject (dogObject.id)}
					<DogCard {dogObject} favorite={false} />
				{/each}
			</section>

			<div class="flex items-center justify-center">
				<Paginator
					bind:settings={paginationSettings}
					on:page={onPageChange}
					showFirstLastButtons={state.firstLast}
					showPreviousNextButtons={state.previousNext}
					select="hidden"
				/>
			</div>
		</Step>
		<Step buttonNextLabel="Match →">
			<svelte:fragment slot="header"
				><header class="text-center mt-10 sm:mt-5">
					<h1
						class="mx-auto mb-2 text-5xl sm:text-3xl md:text-4xl font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500"
					>
						Confirm added dogs
					</h1>
				</header></svelte:fragment
			>
			<section
				class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center"
			>
				{#each $favoriteDogs as dogObject}
					<DogCard {dogObject} favorite={true} />
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
			<svelte:fragment slot="header"
				><header class="text-center mt-10 sm:mt-5">
					<h1
						class="mx-auto mb-2 text-5xl sm:text-3xl md:text-4xl font-bold g:prose-xl max-w-lg leading-tight tracking-tight text-primary-500"
					>
						Congrats! <br />You've Matched With Waldo.
					</h1>
				</header></svelte:fragment
			>
			(content)
		</Step>
	</Stepper>
</main>
