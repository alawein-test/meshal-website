import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running global teardown...');

  // Add any cleanup logic here
  // For example: closing database connections, cleaning up test data, etc.

  console.log('✅ Global teardown complete');
}

export default globalTeardown;
