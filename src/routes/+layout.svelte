<script lang="ts">
	import { AppBar, AppShell } from "@skeletonlabs/skeleton";
    import "../app.pcss";
    import FetchLogo from '$lib/assets/fetch-logo.svg';
	import { PUBLIC_API_URL } from "$env/static/public";
	import { goto } from "$app/navigation";
	import { page } from '$app/stores';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });


	const logoutAction = async () => {
		try {
            const response = await fetch(`${PUBLIC_API_URL}/auth/logout`, {
                method: 'POST',
				credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

			goto('/login')

        } catch (error) {
            console.error('Error:', error);
        }
	}
</script>

<svelte:head>
	<title>Fetch</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
	<AppShell class="flex-grow">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<img src={FetchLogo} alt="Fetch Logo" />
			</svelte:fragment>
			<!-- (title) -->
			<svelte:fragment slot="trail">
				{#if $page.url.pathname != '/login'}
					<button type="button" class="btn variant-filled-primary" on:click={logoutAction}
						>Logout</button
					>
				{/if}
			</svelte:fragment>
		</AppBar>

		<slot />
	</AppShell>

	<footer class="bg-white rounded-lg shadow m-4 dark:bg-gray-800 mt-auto">
		<div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
			<span class="text-sm text-primary-500 sm:text-center">
				© 2023 Fetch Dog Finder
			</span>
			<ul
				class="flex flex-wrap items-center mt-3 text-sm font-medium text-primary-500 sm:mt-0"
			>
				<li><a href="/" class="hover:underline me-4 md:me-6">About</a></li>
				<li><a href="/" class="hover:underline me-4 md:me-6">Privacy Policy</a></li>
				<li><a href="/" class="hover:underline me-4 md:me-6">Licensing</a></li>
				<li><a href="/" class="hover:underline">Contact</a></li>
			</ul>
		</div>
	</footer>
</div>
