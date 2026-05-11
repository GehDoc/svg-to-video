import { type TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preVisit(page) {
    // Determine color scheme from environment variable or default to light
    const colorScheme =
      (process.env.STORYBOOK_THEME as 'light' | 'dark') || 'light';
    await page.emulateMedia({ colorScheme });

    // Allow some time for theme transition if any
    await page.waitForTimeout(100);
  },
};

export default config;
