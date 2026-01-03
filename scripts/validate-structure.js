#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RULES = {
  src: {
    required: ['projects', 'pages', 'components', 'stores', 'hooks', 'types'],
  },
  forbidden: ['.DS_Store', 'tmp', 'temp'],
};

function validateStructure() {
  console.log('🔍 Validating repository structure...');

  let hasErrors = false;

  // Check src structure
  const srcDir = path.join(__dirname, '../src');
  if (fs.existsSync(srcDir)) {
    const sections = fs.readdirSync(srcDir);
    RULES.src.required.forEach((folder) => {
      if (!sections.includes(folder)) {
        console.error(`❌ src/ missing required folder: ${folder}`);
        hasErrors = true;
      }
    });
  } else {
    console.error('❌ src/ directory not found');
    hasErrors = true;
  }

  // Check for forbidden files/directories
  function checkForbidden(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      if (RULES.forbidden.includes(item)) {
        console.error(`❌ Forbidden file/directory found: ${path.join(dir, item)}`);
        hasErrors = true;
      }
    });
  }

  checkForbidden(path.join(__dirname, '..'));
  checkForbidden(path.join(__dirname, '../src'));

  if (hasErrors) {
    process.exit(1);
  }

  console.log('✅ Folder structure is valid');
}

try {
  validateStructure();
} catch (error) {
  console.error('❌ Validation error:', error.message);
  process.exit(1);
}
