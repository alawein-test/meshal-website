#!/usr/bin/env node

/**
 * Update Documentation Coverage Badges
 *
 * This script counts documentation files, components, and other metrics
 * then updates the badges in README.md
 *
 * Usage: node scripts/update-badges.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Count files in a directory matching a pattern
function countFiles(dir, pattern = /.*/) {
  if (!fs.existsSync(dir)) return 0;

  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      count += countFiles(filePath, pattern);
    } else if (pattern.test(file.name)) {
      count++;
    }
  }

  return count;
}

// Count documentation files
function countDocs() {
  const docsDir = path.join(rootDir, 'docs');
  const mdCount = countFiles(docsDir, /\.md$/);

  // Also count root-level docs
  const rootDocs = ['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'CLAUDE.md', 'AUGMENT.md'];
  const rootCount = rootDocs.filter((f) => fs.existsSync(path.join(rootDir, f))).length;

  return mdCount + rootCount;
}

// Count UI components
function countComponents() {
  const uiDir = path.join(rootDir, 'src/components/ui');
  return countFiles(uiDir, /\.tsx$/);
}

// Count platforms
function countPlatforms() {
  const platformsDir = path.join(rootDir, 'src/projects/pages');
  if (!fs.existsSync(platformsDir)) return 0;

  const dirs = fs.readdirSync(platformsDir, { withFileTypes: true });
  return dirs.filter((d) => d.isDirectory() && d.name !== 'index.ts').length;
}

// Count hooks
function countHooks() {
  const hooksDir = path.join(rootDir, 'src/hooks');
  return countFiles(hooksDir, /\.tsx?$/);
}

// Count tests
function countTests() {
  const testsDir = path.join(rootDir, 'tests');
  const srcTests = countFiles(path.join(rootDir, 'src'), /\.test\.tsx?$/);
  const e2eTests = countFiles(testsDir, /\.spec\.tsx?$/);
  return srcTests + e2eTests;
}

// Generate badge URL
function createBadge(label, count, color) {
  const encodedLabel = encodeURIComponent(label);
  const encodedCount = encodeURIComponent(`${count}${count > 1 ? '+' : ''}`);
  return `https://img.shields.io/badge/${encodedLabel}-${encodedCount}-${color}?style=flat-square`;
}

// Update README.md badges
function updateReadme() {
  const readmePath = path.join(rootDir, 'README.md');
  let content = fs.readFileSync(readmePath, 'utf8');

  const counts = {
    docs: countDocs(),
    components: countComponents(),
    platforms: countPlatforms(),
    hooks: countHooks(),
    tests: countTests(),
  };

  console.log('📊 Documentation Coverage:');
  console.log(`   📚 Docs: ${counts.docs} files`);
  console.log(`   🧩 Components: ${counts.components} files`);
  console.log(`   🚀 Platforms: ${counts.platforms}`);
  console.log(`   🪝 Hooks: ${counts.hooks}`);
  console.log(`   🧪 Tests: ${counts.tests}`);

  // Update badge patterns
  const badgePatterns = [
    {
      pattern: /docs-\d+%2B%20pages-blue/g,
      replacement: `docs-${counts.docs}%2B%20pages-blue`,
    },
    {
      pattern: /components-\d+%2B-green/g,
      replacement: `components-${counts.components}%2B-green`,
    },
    {
      pattern: /platforms-\d+-purple/g,
      replacement: `platforms-${counts.platforms}-purple`,
    },
  ];

  for (const { pattern, replacement } of badgePatterns) {
    content = content.replace(pattern, replacement);
  }

  fs.writeFileSync(readmePath, content);
  console.log('\n✅ README.md badges updated!');

  // Output summary for CI
  const summary = {
    timestamp: new Date().toISOString(),
    counts,
    badges: {
      docs: `https://img.shields.io/badge/docs-${counts.docs}%2B%20pages-blue?style=flat-square`,
      components: `https://img.shields.io/badge/components-${counts.components}%2B-green?style=flat-square`,
      platforms: `https://img.shields.io/badge/platforms-${counts.platforms}-purple?style=flat-square`,
    },
  };

  // Write summary for CI artifact
  fs.writeFileSync(path.join(rootDir, 'badge-coverage.json'), JSON.stringify(summary, null, 2));

  return counts;
}

// Run the update
try {
  updateReadme();
} catch (error) {
  console.error('❌ Error updating badges:', error.message);
  process.exit(1);
}
