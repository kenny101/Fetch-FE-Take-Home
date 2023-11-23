<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from "$env/static/public";
	
	let name = ''
	let email = ''
	const handleLogin = async () => {
		try {
            const response = await fetch(`${PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
				credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
				goto('/')
            } else {
                console.error('Authentication failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
	}
</script>

<header class="text-center py-4 my-10 sm:my-5">
	<h1 class="text-center mb-2 text-3xl font-bold">Let's Start Finding Your Furry Companion 🐶</h1>
</header>

<section class="card p-6 space-y-6 shadow-xl text-left max-w-xl mx-auto">
	<form class="space-y-8" on:submit={handleLogin}>
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
