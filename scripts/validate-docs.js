#!/usr/bin/env node

/**
 * Documentation Validation Script
 * Checks for broken internal links, external URLs, asset references,
 * and outdated file references in markdown files.
 *
 * Usage:
 *   node scripts/validate-docs.js           # Interactive output
 *   node scripts/validate-docs.js --ci      # JSON output for CI
 *   node scripts/validate-docs.js --fix     # Suggest fixes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

// CLI flags
const args = process.argv.slice(2);
const CI_MODE = args.includes('--ci');
const FIX_MODE = args.includes('--fix');
const VERBOSE = args.includes('--verbose');

// Patterns to match internal links and file references
const PATTERNS = {
  markdownLinks: /\[([^\]]*)\]\(([^)]+)\)/g,
  codeBlocks: /```[\s\S]*?```/g,
  inlineCode: /`[^`]+`/g,
  imageRefs: /!\[([^\]]*)\]\(([^)]+)\)/g,
};

// Files/directories to ignore
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  '.turbo',
  '.husky/_',
  'coverage',
  'test-results',
  'playwright-report',
];

// External link timeout (ms)
const EXTERNAL_LINK_TIMEOUT = 5000;

// Track all issues found
const issues = {
  brokenLinks: [],
  deadExternalLinks: [],
  missingAssets: [],
  missingFiles: [],
  warnings: [],
};

/**
 * Get all markdown files in the project
 */
function getMarkdownFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    if (IGNORE_PATTERNS.some((pattern) => fullPath.includes(pattern))) {
      continue;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Check if a path exists (file or directory)
 */
function pathExists(targetPath) {
  try {
    fs.accessSync(targetPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check external URL availability
 */
async function checkExternalLink(url, timeout = EXTERNAL_LINK_TIMEOUT) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, { timeout }, (res) => {
      resolve({
        ok: res.statusCode >= 200 && res.statusCode < 400,
        status: res.statusCode,
      });
    });

    req.on('error', () => resolve({ ok: false, status: 0 }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, status: 'timeout' });
    });
  });
}

/**
 * Extract links from markdown content
 */
function extractLinks(content, filePath) {
  const links = [];

  // Remove code blocks to avoid false positives
  const contentWithoutCode = content
    .replace(PATTERNS.codeBlocks, '')
    .replace(PATTERNS.inlineCode, '');

  let match;
  while ((match = PATTERNS.markdownLinks.exec(contentWithoutCode)) !== null) {
    const [fullMatch, linkText, linkTarget] = match;

    // Categorize link type
    const isExternal = linkTarget.startsWith('http://') || linkTarget.startsWith('https://');
    const isAnchor = linkTarget.startsWith('#');
    const isSpecial = linkTarget.startsWith('mailto:') || linkTarget.startsWith('tel:');

    if (isAnchor || isSpecial) {
      continue;
    }

    links.push({
      text: linkText,
      target: linkTarget.split('#')[0], // Remove anchor from path
      line: getLineNumber(content, match.index),
      filePath,
      isExternal,
    });
  }

  return links;
}

/**
 * Extract image references
 */
function extractImages(content, filePath) {
  const images = [];

  const contentWithoutCode = content.replace(PATTERNS.codeBlocks, '');

  let match;
  while ((match = PATTERNS.imageRefs.exec(contentWithoutCode)) !== null) {
    const [fullMatch, altText, src] = match;

    if (src.startsWith('http://') || src.startsWith('https://')) {
      continue; // Skip external images
    }

    images.push({
      alt: altText,
      src,
      line: getLineNumber(content, match.index),
      filePath,
    });
  }

  return images;
}

/**
 * Get line number from character index
 */
function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

/**
 * Validate a single internal link
 */
function validateInternalLink(link) {
  const sourceDir = path.dirname(link.filePath);
  let targetPath;

  if (link.target.startsWith('./') || link.target.startsWith('../')) {
    targetPath = path.resolve(sourceDir, link.target);
  } else if (link.target.startsWith('/')) {
    targetPath = path.join(ROOT_DIR, link.target);
  } else {
    targetPath = path.resolve(sourceDir, link.target);
  }

  if (!pathExists(targetPath)) {
    const extensions = ['.md', '.ts', '.tsx', '.js', '.jsx', '.json'];
    const found = extensions.some((ext) => pathExists(targetPath + ext));

    if (!found) {
      issues.brokenLinks.push({
        source: path.relative(ROOT_DIR, link.filePath),
        target: link.target,
        line: link.line,
        text: link.text,
        suggestion: FIX_MODE ? findSimilarFile(link.target) : null,
      });
    }
  }
}

/**
 * Find similar file for fix suggestions
 */
function findSimilarFile(target) {
  const basename = path.basename(target);
  const allFiles = getAllFiles(ROOT_DIR);

  for (const file of allFiles) {
    if (path.basename(file) === basename) {
      return path.relative(ROOT_DIR, file);
    }
  }

  return null;
}

/**
 * Get all files recursively
 */
function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    if (IGNORE_PATTERNS.some((pattern) => fullPath.includes(pattern))) {
      continue;
    }

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Validate image reference
 */
function validateImage(image) {
  const sourceDir = path.dirname(image.filePath);
  let targetPath;

  if (image.src.startsWith('./') || image.src.startsWith('../')) {
    targetPath = path.resolve(sourceDir, image.src);
  } else if (image.src.startsWith('/')) {
    targetPath = path.join(ROOT_DIR, 'public', image.src);
  } else {
    targetPath = path.resolve(sourceDir, image.src);
  }

  if (!pathExists(targetPath)) {
    issues.missingAssets.push({
      source: path.relative(ROOT_DIR, image.filePath),
      asset: image.src,
      line: image.line,
      alt: image.alt,
    });
  }
}

/**
 * Check for references to non-existent directories
 */
function checkDirectoryReferences(content, filePath) {
  const knownMissingDirs = [
    'design-system/',
    'packages/',
    'src/services/',
    'src/config/',
    'src/components/design-engines/',
    'src/components/layout/',
  ];

  const relativePath = path.relative(ROOT_DIR, filePath);

  for (const dir of knownMissingDirs) {
    if (content.includes(dir)) {
      const actualPath = path.join(ROOT_DIR, dir);
      if (!pathExists(actualPath)) {
        issues.missingFiles.push({
          source: relativePath,
          reference: dir,
          message: `References non-existent directory: ${dir}`,
        });
      }
    }
  }
}

/**
 * Check for outdated store references
 */
function checkStoreReferences(content, filePath) {
  const storeDir = path.join(ROOT_DIR, 'src/stores');
  const actualStores = fs.existsSync(storeDir)
    ? fs
        .readdirSync(storeDir)
        .filter((f) => f.endsWith('.ts'))
        .map((f) => f.replace('.ts', ''))
    : [];

  const referencedStores = [
    'themeStore',
    'uiStore',
    'authStore',
    'guestStore',
    'notificationStore',
  ];
  const relativePath = path.relative(ROOT_DIR, filePath);

  for (const store of referencedStores) {
    if (content.includes(store) && !actualStores.includes(store) && store !== 'index') {
      issues.warnings.push({
        source: relativePath,
        message: `References potentially non-existent store: ${store}`,
        severity: 'warning',
      });
    }
  }
}

/**
 * Check frontmatter for freshness metadata
 */
function checkFreshness(content, filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);

  // Check for last_verified or Last verified metadata
  if (!content.includes('last_verified') && !content.includes('Last verified')) {
    issues.warnings.push({
      source: relativePath,
      message: 'Missing freshness metadata (last_verified date)',
      severity: 'info',
    });
  }
}

/**
 * Main validation function
 */
async function validateDocs() {
  if (!CI_MODE) {
    console.log('📚 Validating documentation...\n');
  }

  const markdownFiles = getMarkdownFiles(ROOT_DIR);

  if (!CI_MODE) {
    console.log(`Found ${markdownFiles.length} markdown files\n`);
  }

  const externalLinks = [];

  for (const filePath of markdownFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract and validate links
    const links = extractLinks(content, filePath);

    for (const link of links) {
      if (link.isExternal) {
        externalLinks.push(link);
      } else {
        validateInternalLink(link);
      }
    }

    // Extract and validate images
    const images = extractImages(content, filePath);
    images.forEach(validateImage);

    // Check for directory references
    checkDirectoryReferences(content, filePath);

    // Check for store references
    checkStoreReferences(content, filePath);

    // Check for freshness metadata
    if (VERBOSE) {
      checkFreshness(content, filePath);
    }
  }

  // Check external links (sample - limit to avoid rate limiting)
  if (externalLinks.length > 0 && !CI_MODE) {
    console.log(`Checking ${Math.min(externalLinks.length, 10)} external links...\n`);

    for (const link of externalLinks.slice(0, 10)) {
      const result = await checkExternalLink(link.target);
      if (!result.ok) {
        issues.deadExternalLinks.push({
          source: path.relative(ROOT_DIR, link.filePath),
          url: link.target,
          line: link.line,
          status: result.status,
        });
      }
    }
  }

  // Output results
  if (CI_MODE) {
    outputJSON();
  } else {
    outputInteractive();
  }
}

/**
 * Output results as JSON for CI
 */
function outputJSON() {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      brokenLinks: issues.brokenLinks.length,
      deadExternalLinks: issues.deadExternalLinks.length,
      missingAssets: issues.missingAssets.length,
      missingFiles: issues.missingFiles.length,
      warnings: issues.warnings.length,
    },
    issues,
    success:
      issues.brokenLinks.length === 0 &&
      issues.missingFiles.length === 0 &&
      issues.missingAssets.length === 0,
  };

  // Write report to file for CI artifact upload
  const reportPath = path.join(ROOT_DIR, 'docs-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(JSON.stringify(report, null, 2));

  if (!report.success) {
    process.exit(1);
  }
}

/**
 * Output results interactively
 */
function outputInteractive() {
  let hasErrors = false;

  if (issues.brokenLinks.length > 0) {
    hasErrors = true;
    console.log('❌ Broken Internal Links:\n');
    issues.brokenLinks.forEach((issue) => {
      console.log(`  ${issue.source}:${issue.line}`);
      console.log(`    Link text: "${issue.text}"`);
      console.log(`    Target: ${issue.target}`);
      if (issue.suggestion) {
        console.log(`    💡 Did you mean: ${issue.suggestion}`);
      }
      console.log();
    });
  }

  if (issues.deadExternalLinks.length > 0) {
    console.log('⚠️  Dead External Links:\n');
    issues.deadExternalLinks.forEach((issue) => {
      console.log(`  ${issue.source}:${issue.line}`);
      console.log(`    URL: ${issue.url}`);
      console.log(`    Status: ${issue.status}\n`);
    });
  }

  if (issues.missingAssets.length > 0) {
    hasErrors = true;
    console.log('❌ Missing Assets:\n');
    issues.missingAssets.forEach((issue) => {
      console.log(`  ${issue.source}:${issue.line}`);
      console.log(`    Asset: ${issue.asset}`);
      console.log(`    Alt text: "${issue.alt}"\n`);
    });
  }

  if (issues.missingFiles.length > 0) {
    hasErrors = true;
    console.log('❌ References to Non-Existent Paths:\n');
    issues.missingFiles.forEach((issue) => {
      console.log(`  ${issue.source}`);
      console.log(`    ${issue.message}\n`);
    });
  }

  if (issues.warnings.length > 0) {
    console.log('⚠️  Warnings:\n');
    issues.warnings.forEach((issue) => {
      console.log(`  ${issue.source}`);
      console.log(`    ${issue.message}\n`);
    });
  }

  // Summary
  console.log('═'.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Broken internal links: ${issues.brokenLinks.length}`);
  console.log(`   Dead external links:   ${issues.deadExternalLinks.length}`);
  console.log(`   Missing assets:        ${issues.missingAssets.length}`);
  console.log(`   Missing directories:   ${issues.missingFiles.length}`);
  console.log(`   Warnings:              ${issues.warnings.length}`);
  console.log('═'.repeat(50));

  if (!hasErrors && issues.warnings.length === 0) {
    console.log('\n✅ All documentation links and references are valid!\n');
  } else if (!hasErrors) {
    console.log('\n✅ No broken links found (warnings exist but are non-blocking)\n');
  } else {
    console.log('\n💡 Run with --fix to see suggestions for broken links.');
    console.log('💡 Run with --ci for JSON output.\n');
    process.exit(1);
  }
}

// Run validation
try {
  validateDocs();
} catch (error) {
  console.error('❌ Documentation validation error:', error.message);
  process.exit(1);
}
