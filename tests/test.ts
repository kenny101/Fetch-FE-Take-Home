import { expect, test } from '@playwright/test';

test('logout clears cookie', async ({ page }) => {
	await page.goto('/logout');
	const cookiesAfterLogout = await page.context().cookies();
	const authTokenCookie = cookiesAfterLogout.find(cookie => cookie.name === 'auth_token');
	expect(authTokenCookie).toBeUndefined();
});

test('logout redirects to login', async ({ page }) => {
	const initialUrl = page.url();

	await page.goto('/logout');

	const loginPageURL = '/login';
	await page.waitForURL(loginPageURL);

	const finalUrl = page.url();

	// Assert that the URL has changed and is now the login page
	expect(initialUrl).not.toEqual(finalUrl);
	expect(finalUrl).toContain(loginPageURL);
});


test('clearing cookies and refreshing redirects to login on the homepage', async ({ page }) => {
	await page.goto('/');
	await page.context().clearCookies();
	await page.reload();

	const loginPageURL = '/login'; 
	await page.waitForURL(loginPageURL);

	const finalUrl = page.url();
	expect(finalUrl).toContain(loginPageURL);
});
