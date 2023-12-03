<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import DogImage from '$lib/assets/doggo.jpg';
	import { superForm } from 'sveltekit-superforms/client';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { userLoginSchema } from '$lib/schemas/formSchemas.js';
	import Icon from '@iconify/svelte';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data;

	const { form, errors, enhance, message, delayed, capture, restore } = superForm(data.form, {
		validators: userLoginSchema,
		taintedMessage: null
	});

	export const snapshot = { capture, restore };

	let isLoading: boolean = false;

	const handleLogin = async (name: string, email: string) => {
		isLoading = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/auth/login`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, email })
			});

			if (response.ok) {
				goto('/');
			} else {
				console.error('Authentication failed');
			}
		} catch (error) {
			console.error('Error:', error);
		}
		isLoading = false;
	};
</script>

<header class="text-center mt-10">
	<h1 class="text-center h1 font-bold text-primary-500 mb-10">
		Let's Start Finding Your Furry Companion
	</h1>
	<img src={DogImage} alt="dog peeking out" class="mx-auto h-60 object-cover" />
</header>

<section class="card p-6 shadow-xl text-left max-w-xl mx-auto">
	<!-- <SuperDebug data={$form} /> -->

	<form
		class="space-y-4"
		method="POST"
		use:enhance
		on:submit={() => handleLogin($form.name, $form.email)}
	>
		<label class="label" for="name"
			>Name
			<input
				bind:value={$form.name}
				name="name"
				id="name"
				type="name"
				placeholder="John Doe"
				class="input p-1"
				aria-invalid={$errors.name ? 'true' : undefined}
				required
			/>
			{#if $errors.name}
				<small class="text-error-500">{$errors.name}</small>
			{/if}
		</label>

		<label class="label" for="email"
			>Email
			<input
				bind:value={$form.email}
				name="email"
				type="email"
				id="email"
				placeholder="email@example.com"
				class="input p-1"
				aria-invalid={$errors.email ? 'true' : undefined}
				required
			/>
			{#if $errors.email}
				<small class="text-error-500">{$errors.email}</small>
			{/if}
		</label>

		{#if $message}
			<aside class="alert variant-soft">
				<Icon icon="icon-park-solid:caution" class="h3 mx-5" />
				<div class="alert-message">
					<p>Unable to login: {$message}</p>
				</div>
			</aside>
		{/if}

		<button
			type="submit"
			disabled={$delayed || isLoading}
			class="btn variant-filled-primary w-full"
		>
			{#if $delayed || isLoading}
				Logging In &nbsp;
				<ProgressRadial width="w-5" meter="stroke-primary-50" />
			{:else}
				Login
			{/if}
		</button>
	</form>
</section>
