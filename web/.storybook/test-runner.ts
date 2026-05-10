import { type TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    // Determine color scheme from environment variable or default to light
    const colorScheme =
      (process.env.STORYBOOK_THEME as 'light' | 'dark') || 'light';
    await page.emulateMedia({ colorScheme });

    // Allow some time for theme transition if any
    await page.waitForTimeout(100);

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  },
};

export default config;
