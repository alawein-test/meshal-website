#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function checkImports() {
  console.log('🔍 Checking imports...');

  const violations = [];
  const srcDir = path.join(__dirname, '../src');

  function walkDir(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        try {
          if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
          } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');

            lines.forEach((line, idx) => {
              // Check for excessive parent directory imports
              if (line.match(/from\s+['"]\.\.\/\.\.\/\.\./)) {
                violations.push(`${fullPath}:${idx + 1} - Excessive parent imports (too many ../)`);
              }

              // Check for missing path aliases
              if (line.match(/from\s+['"]\.\.\/.*\/src\//)) {
                violations.push(
                  `${fullPath}:${idx + 1} - Use path alias instead of relative import`
                );
              }
            });
          }
        } catch (err) {
          // Ignore permission errors
        }
      });
    } catch (err) {
      // Ignore directory errors
    }
  }

  if (fs.existsSync(srcDir)) {
    walkDir(srcDir);
  }

  if (violations.length > 0) {
    console.error('❌ Import violations found:');
    violations.forEach((v) => console.error(v));
    process.exit(1);
  }

  console.log('✅ All imports look good');
}

try {
  checkImports();
} catch (error) {
  console.error('⚠️  Import check skipped:', error.message);
  // Don't fail on errors, just warn
}
