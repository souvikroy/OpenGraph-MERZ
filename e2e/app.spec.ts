import { test, expect } from '@playwright/test';

test.describe('end-to-end smoke', () => {
  test('serves static logo', async ({ request }) => {
    const res = await request.get('/logo.png');
    expect(res.status()).toBe(200);
    const ct = res.headers()['content-type'] ?? '';
    expect(ct).toMatch(/image\/(png|jpeg|webp|gif)/i);
  });

  test('HTML shell includes OpenGraph and title', async ({ request }) => {
    const res = await request.get('/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toMatch(/og:title/);
    expect(html).toMatch(/og:image/);
    expect(html).toMatch(/name="twitter:card"/);
    expect(html).toContain('OpenGraph × Merz');
  });

  test('PWA manifest uses OpenGraph brand', async ({ request }) => {
    const res = await request.get('/manifest.json');
    expect(res.status()).toBe(200);
    const json = (await res.json()) as { name: string; short_name: string };
    expect(json.name).toMatch(/OpenGraph/);
    expect(json.short_name).toMatch(/OpenGraph/);
  });
});

test.describe('login and navigation', () => {
  test('login page shows rebrand, logo, and page title', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/OpenGraph × Merz/);
    await expect(page.getByText('OpenGraph × Merz').first()).toBeVisible();
    const logo = page.locator('img[src="/logo.png"]');
    await expect(logo).toBeVisible();
  });

  test('signs in (demo) and shows dashboard with sidebar brand', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('OpenGraph', { exact: true })).toBeVisible();
  });

  test('rejects invalid access code', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('MERZ-OPENGRAPH-2026').fill('not-a-valid-code');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Invalid access code').first()).toBeVisible();
  });

  test('valid demo code and navigate to Product Expert', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('MERZ-OPENGRAPH-2026').fill('MERZ-OPENGRAPH-2026');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.getByRole('link', { name: 'AI Product Expert' }).click();
    await expect(page).toHaveURL(/\/product-expert\/chat/);
    await expect(
      page.getByRole('heading', { name: 'Product Expert', exact: true })
    ).toBeVisible();
  });
});
