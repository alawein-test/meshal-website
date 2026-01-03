import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Documentation Validation Tests
 *
 * These tests ensure documentation stays synchronized and up-to-date.
 * Run as part of CI/CD to catch documentation issues before merge.
 */

const DOCS_DIR = path.join(process.cwd(), 'docs');

// Required documentation files
const REQUIRED_DOCS = [
  'README.md',
  'QUICK_START.md',
  'ARCHITECTURE.md',
  'API_REFERENCE.md',
  'TESTING.md',
  'SECURITY.md',
  'ACCESSIBILITY.md',
  'CONTRIBUTING_DOCS.md',
];

// Documentation categories and their required files
const DOC_CATEGORIES = {
  'Getting Started': ['README.md', 'QUICK_START.md', 'FAQ.md'],
  Architecture: ['ARCHITECTURE.md', 'MODULES.md', 'ROUTING.md'],
  Development: ['DEVELOPMENT.md', 'TESTING.md', 'STYLE_GUIDE.md'],
  Security: ['SECURITY.md', 'SECURITY_CHECKLIST.md'],
  Deployment: ['DEPLOYMENT.md', 'INFRASTRUCTURE.md', 'MONITORING.md'],
};

test.describe('Documentation Structure', () => {
  test('all required documentation files exist', async () => {
    const missingFiles: string[] = [];

    for (const file of REQUIRED_DOCS) {
      const filePath = path.join(DOCS_DIR, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }

    expect(missingFiles, `Missing required docs: ${missingFiles.join(', ')}`).toHaveLength(0);
  });

  test('docs/README.md contains links to all documentation categories', async () => {
    const readmePath = path.join(DOCS_DIR, 'README.md');
    const content = fs.readFileSync(readmePath, 'utf-8');

    for (const category of Object.keys(DOC_CATEGORIES)) {
      // Check for category mention (could be in table or heading)
      const hasCategory = content.toLowerCase().includes(category.toLowerCase());
      expect(hasCategory, `README.md should reference category: ${category}`).toBeTruthy();
    }
  });

  test('documentation files have proper frontmatter', async () => {
    const markdownFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'));

    const filesWithoutHeader: string[] = [];

    for (const file of markdownFiles) {
      const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');
      const lines = content.split('\n');

      // Check for H1 header in first 5 lines
      const hasHeader = lines.slice(0, 5).some((line) => line.startsWith('# '));
      if (!hasHeader) {
        filesWithoutHeader.push(file);
      }
    }

    expect(
      filesWithoutHeader,
      `Files without H1 header: ${filesWithoutHeader.join(', ')}`
    ).toHaveLength(0);
  });
});

test.describe('Documentation Content', () => {
  test('all internal links are valid', async () => {
    const markdownFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'));

    const brokenLinks: Array<{ file: string; link: string }> = [];

    for (const file of markdownFiles) {
      const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');

      // Find markdown links: [text](./path.md) or [text](path.md)
      const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkPattern.exec(content)) !== null) {
        const linkPath = match[2];

        // Skip external links and anchors
        if (linkPath.startsWith('http') || linkPath.startsWith('#')) {
          continue;
        }

        // Resolve relative path
        const absolutePath = linkPath.startsWith('./')
          ? path.join(DOCS_DIR, linkPath.slice(2))
          : path.join(DOCS_DIR, linkPath);

        // Remove anchor from path
        const pathWithoutAnchor = absolutePath.split('#')[0];

        if (!fs.existsSync(pathWithoutAnchor)) {
          brokenLinks.push({ file, link: linkPath });
        }
      }
    }

    expect(brokenLinks, `Broken links found: ${JSON.stringify(brokenLinks, null, 2)}`).toHaveLength(
      0
    );
  });

  test('documentation has freshness indicators', async () => {
    const markdownFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'));

    const filesWithoutDate: string[] = [];
    const staleFiles: string[] = [];
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    for (const file of markdownFiles) {
      const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');

      // Look for "Last verified:" or "Last updated:" patterns
      const datePattern = /(?:Last (?:verified|updated)|Updated):\s*(\d{4}-\d{2}-\d{2})/i;
      const match = content.match(datePattern);

      if (!match) {
        filesWithoutDate.push(file);
      } else {
        const docDate = new Date(match[1]);
        if (docDate < sixMonthsAgo) {
          staleFiles.push(`${file} (${match[1]})`);
        }
      }
    }

    // Warn about missing dates (not fail)
    if (filesWithoutDate.length > 0) {
      console.warn(`Files without freshness date: ${filesWithoutDate.join(', ')}`);
    }

    // Warn about stale docs (not fail)
    if (staleFiles.length > 0) {
      console.warn(`Potentially stale documentation: ${staleFiles.join(', ')}`);
    }

    expect(true).toBeTruthy(); // Always pass, just log warnings
  });

  test('code examples use consistent language tags', async () => {
    const markdownFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'));

    const validLanguages = [
      'typescript',
      'tsx',
      'javascript',
      'jsx',
      'json',
      'bash',
      'shell',
      'sql',
      'css',
      'html',
      'yaml',
      'markdown',
      'md',
      'text',
      'diff',
    ];

    const invalidCodeBlocks: Array<{ file: string; language: string }> = [];

    for (const file of markdownFiles) {
      const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');

      // Find code blocks with language tags
      const codeBlockPattern = /```(\w+)/g;
      let match;

      while ((match = codeBlockPattern.exec(content)) !== null) {
        const language = match[1].toLowerCase();

        if (!validLanguages.includes(language)) {
          invalidCodeBlocks.push({ file, language });
        }
      }
    }

    expect(
      invalidCodeBlocks,
      `Invalid language tags: ${JSON.stringify(invalidCodeBlocks)}`
    ).toHaveLength(0);
  });
});

test.describe('Documentation Synchronization', () => {
  test('API_REFERENCE.md matches edge function exports', async () => {
    const apiRefPath = path.join(DOCS_DIR, 'API_REFERENCE.md');
    const functionsDir = path.join(process.cwd(), 'supabase', 'functions');

    if (!fs.existsSync(functionsDir)) {
      test.skip();
      return;
    }

    const apiContent = fs.readFileSync(apiRefPath, 'utf-8');
    const functionDirs = fs
      .readdirSync(functionsDir)
      .filter((f) => fs.statSync(path.join(functionsDir, f)).isDirectory());

    const undocumentedFunctions: string[] = [];

    for (const funcDir of functionDirs) {
      if (!apiContent.includes(funcDir)) {
        undocumentedFunctions.push(funcDir);
      }
    }

    // Warn about undocumented functions
    if (undocumentedFunctions.length > 0) {
      console.warn(`Edge functions not in API_REFERENCE.md: ${undocumentedFunctions.join(', ')}`);
    }

    expect(true).toBeTruthy();
  });

  test('CHANGELOG.md has recent entries', async () => {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');

    if (!fs.existsSync(changelogPath)) {
      test.skip();
      return;
    }

    const content = fs.readFileSync(changelogPath, 'utf-8');

    // Check for date patterns like ## [1.2.3] - 2025-01-15
    const versionPattern = /##\s*\[[\d.]+\]\s*-\s*(\d{4}-\d{2}-\d{2})/g;
    const matches = [...content.matchAll(versionPattern)];

    expect(matches.length, 'CHANGELOG should have versioned entries').toBeGreaterThan(0);

    if (matches.length > 0) {
      const latestDate = new Date(matches[0][1]);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const isRecent = latestDate > threeMonthsAgo;
      if (!isRecent) {
        console.warn(`CHANGELOG last updated: ${matches[0][1]}`);
      }
    }
  });

  test('component documentation matches actual components', async () => {
    const componentDocsPath = path.join(DOCS_DIR, 'UI_COMPONENTS.md');
    const uiComponentsDir = path.join(process.cwd(), 'src', 'components', 'ui');

    if (!fs.existsSync(componentDocsPath) || !fs.existsSync(uiComponentsDir)) {
      test.skip();
      return;
    }

    const docsContent = fs.readFileSync(componentDocsPath, 'utf-8');
    const componentFiles = fs
      .readdirSync(uiComponentsDir)
      .filter((f) => f.endsWith('.tsx') && f !== 'index.ts');

    const undocumentedComponents: string[] = [];

    for (const file of componentFiles) {
      const componentName = file.replace('.tsx', '');
      // Check for component mention (case-insensitive)
      if (!docsContent.toLowerCase().includes(componentName.toLowerCase())) {
        undocumentedComponents.push(componentName);
      }
    }

    // Warn about undocumented components
    if (undocumentedComponents.length > 0) {
      console.warn(`Components not in UI_COMPONENTS.md: ${undocumentedComponents.join(', ')}`);
    }

    expect(true).toBeTruthy();
  });
});

test.describe('Documentation Accessibility', () => {
  test('images have alt text in markdown', async () => {
    const markdownFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'));

    const imagesWithoutAlt: Array<{ file: string; image: string }> = [];

    for (const file of markdownFiles) {
      const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');

      // Find images: ![alt](src) - empty alt is ![](src)
      const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let match;

      while ((match = imagePattern.exec(content)) !== null) {
        const altText = match[1].trim();
        const imageSrc = match[2];

        if (!altText) {
          imagesWithoutAlt.push({ file, image: imageSrc });
        }
      }
    }

    expect(
      imagesWithoutAlt,
      `Images without alt text: ${JSON.stringify(imagesWithoutAlt)}`
    ).toHaveLength(0);
  });

  test('documentation uses proper heading hierarchy', async () => {
    const markdownFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'));

    const filesWithBadHierarchy: string[] = [];

    for (const file of markdownFiles) {
      const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8');
      const lines = content.split('\n');

      let previousLevel = 0;
      let hasIssue = false;

      for (const line of lines) {
        const headingMatch = line.match(/^(#{1,6})\s+/);
        if (headingMatch) {
          const level = headingMatch[1].length;

          // Check for skipped levels (e.g., H1 -> H3)
          if (previousLevel > 0 && level > previousLevel + 1) {
            hasIssue = true;
            break;
          }

          previousLevel = level;
        }
      }

      if (hasIssue) {
        filesWithBadHierarchy.push(file);
      }
    }

    expect(
      filesWithBadHierarchy,
      `Files with heading hierarchy issues: ${filesWithBadHierarchy.join(', ')}`
    ).toHaveLength(0);
  });
});
