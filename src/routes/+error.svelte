<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1>
	{$page.error?.message
		? $page.error.message
		: 'An unexpected error occurred please refresh or try again later.'}
</h1>
