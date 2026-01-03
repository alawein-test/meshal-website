import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🔧 Running global setup...');

  // Create auth fixtures directory if it doesn't exist
  const authDir = path.join(__dirname, 'auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Create empty auth state file for tests that don't require auth
  const authStatePath = path.join(authDir, 'client-auth.json');
  if (!fs.existsSync(authStatePath)) {
    fs.writeFileSync(
      authStatePath,
      JSON.stringify({
        cookies: [],
        origins: [],
      })
    );
  }

  // Optional: Pre-warm the browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Wait for the dev server to be ready
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:8081';

  try {
    await page.goto(baseURL, { timeout: 30000 });
    console.log('✅ Dev server is ready');
  } catch (error) {
    console.log('⚠️ Dev server might not be ready yet, tests will wait...');
  }

  await browser.close();

  console.log('✅ Global setup complete');
}

export default globalSetup;
