const { test, expect } = require('@playwright/test');
const WikipediaPage = require('../pages/wikipediaPage');

test('Wikipedia search - Playwright (POM)', async ({ page }) => {
  const wiki = new WikipediaPage(page);

  // Navigate to Wikipedia
  await wiki.goto();

  // Basic visibility check for search input
  await expect(wiki.searchInput).toBeVisible();

  // Perform search using POM
  await wiki.search('Playwright');

  // Assert heading contains expected text
  await wiki.assertHeadingContains(/Playwright/i);

  // Save a screenshot to the report folder
  await wiki.screenshot('playwright-report/wikipedia-playwright.png');
});
