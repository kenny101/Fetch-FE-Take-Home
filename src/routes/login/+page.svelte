<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import DogImage from '$lib/assets/doggo.jpg';

	let name = '';
	let email = '';
	const handleLogin = async () => {
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
	};
</script>

<header class="text-center mt-10">
	<h1 class="text-center h1 font-bold text-primary-500 mb-10">
		Let's Start Finding Your Furry Companion
	</h1>
	<img src={DogImage} alt="dog peeking out" class="mx-auto h-60 object-cover" />
</header>

<section class="card p-6 shadow-xl text-left max-w-xl mx-auto ">
	<form class="space-y-8 " on:submit={handleLogin}>
		<label class="label" for="name"
			>Name
			<input
				bind:value={name}
				name="name"
				id="name"
				type="name"
				placeholder="John Doe"
				class="input p-1"
				required
			/>
		</label>

		<label class="label" for="email"
			>Email
			<input
				bind:value={email}
				name="email"
				id="email"
				type="email"
				placeholder="email@example.com"
				class="input p-1"
				required
			/>
		</label>
		<button type="submit" class="btn variant-filled-primary w-full">Login</button>
	</form>
</section>
