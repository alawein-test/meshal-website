/**
 * Danger.js Configuration - Automated PR Review
 * This file runs automatically on every PR to enforce quality standards
 */

import { danger, fail, warn, message, markdown } from 'danger';

// Configuration
const CONFIG = {
  maxFileSize: 100000, // 100KB
  maxPRSize: 50,
  minTestCoverage: 80,
  maxConsoleStatements: 0,
  maxTodos: 5,
  requiredFiles: {
    tests: /\.(test|spec)\.(ts|tsx|js|jsx)$/,
    docs: /\.(md|mdx)$/,
  },
  semanticPrefixes: [
    'feat',
    'fix',
    'docs',
    'style',
    'refactor',
    'test',
    'chore',
    'perf',
    'build',
    'ci',
    'revert',
  ],
  forbiddenPatterns: {
    hardcodedColors:
      /\b(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)\b/g,
    consoleLog: /console\.(log|debug|trace)/g,
    apiKeys: /api[_-]?key|secret|password|token|private[_-]?key/gi,
    todoComments: /\b(TODO|FIXME|HACK|XXX)\b/g,
  },
};

// Helper functions
const getAddedLines = (file) => {
  return danger.git.diffForFile(file).then((diff) => {
    if (!diff) return [];
    return diff.added.split('\n').filter((line) => line.trim());
  });
};

// =============================================================================
// 1. PR SIZE CHECK
// =============================================================================
const prSize = danger.github.pr.additions + danger.github.pr.deletions;
if (prSize > 1000) {
  warn(
    `🔍 This PR is quite large (${prSize} lines changed). Consider breaking it into smaller PRs for easier review.`
  );
} else if (prSize > 500) {
  message(`📊 PR size: ${prSize} lines changed`);
}

// =============================================================================
// 2. COMMIT MESSAGE VALIDATION
// =============================================================================
const prTitle = danger.github.pr.title;
const hasSemanticPrefix = CONFIG.semanticPrefixes.some(
  (prefix) =>
    prTitle.toLowerCase().startsWith(prefix + ':') || prTitle.toLowerCase().startsWith(prefix + '(')
);

if (!hasSemanticPrefix) {
  fail(`📝 PR title should start with a semantic prefix: ${CONFIG.semanticPrefixes.join(', ')}`);
}

// =============================================================================
// 3. FILE SIZE CHECKS
// =============================================================================
const createdFiles = danger.git.created_files;
const modifiedFiles = danger.git.modified_files;
const allFiles = [...createdFiles, ...modifiedFiles];

allFiles.forEach((file) => {
  const fileSize = danger.github.utils.fileSize(file);
  if (fileSize > CONFIG.maxFileSize) {
    warn(
      `📦 File \`${file}\` is ${Math.round(fileSize / 1024)}KB. Consider splitting or optimizing it.`
    );
  }
});

// Check for large assets
const assetFiles = allFiles.filter((f) => /\.(jpg|jpeg|png|gif|svg|mp4|webm)$/i.test(f));
if (assetFiles.length > 0) {
  assetFiles.forEach(async (file) => {
    const size = danger.github.utils.fileSize(file);
    if (size > 500000) {
      // 500KB for assets
      fail(`🖼️ Asset \`${file}\` is too large (${Math.round(size / 1024)}KB). Please optimize it.`);
    }
  });
}

// =============================================================================
// 4. DESIGN SYSTEM COMPLIANCE
// =============================================================================
Promise.all(
  allFiles
    .filter((f) => /\.(tsx|ts|jsx|js)$/.test(f))
    .map(async (file) => {
      const lines = await getAddedLines(file);

      // Check for hardcoded colors
      lines.forEach((line, index) => {
        const colorMatch = line.match(CONFIG.forbiddenPatterns.hardcodedColors);
        if (colorMatch) {
          fail(
            `🎨 Hardcoded color found in \`${file}\`: "${colorMatch[0]}". Use semantic tokens instead.`
          );
        }
      });
    })
);

// =============================================================================
// 5. CONSOLE STATEMENT CHECK
// =============================================================================
Promise.all(
  allFiles
    .filter((f) => /\.(tsx|ts|jsx|js)$/.test(f) && !f.includes('.test.') && !f.includes('.spec.'))
    .map(async (file) => {
      const lines = await getAddedLines(file);

      lines.forEach((line) => {
        if (CONFIG.forbiddenPatterns.consoleLog.test(line)) {
          fail(`🚫 Console statement found in \`${file}\`. Remove before merging.`);
        }
      });
    })
);

// =============================================================================
// 6. SECURITY CHECKS
// =============================================================================
Promise.all(
  allFiles.map(async (file) => {
    const lines = await getAddedLines(file);

    lines.forEach((line) => {
      // Check for potential secrets
      if (
        CONFIG.forbiddenPatterns.apiKeys.test(line) &&
        !line.includes('process.env') &&
        !line.includes('import.meta.env')
      ) {
        fail(`🔐 Potential secret/API key found in \`${file}\`. Never commit secrets!`);
      }
    });
  })
);

// Check if .env file is being committed
if (allFiles.includes('.env')) {
  fail('🚨 `.env` file should never be committed! Add it to `.gitignore`.');
}

// =============================================================================
// 7. TEST COVERAGE
// =============================================================================
const hasSourceChanges = allFiles.some(
  (f) =>
    f.startsWith('src/') &&
    !f.includes('.test.') &&
    !f.includes('.spec.') &&
    /\.(tsx|ts|jsx|js)$/.test(f)
);

const hasTests = allFiles.some((f) => /\.(test|spec)\.(tsx|ts|jsx|js)$/.test(f));

if (hasSourceChanges && !hasTests) {
  warn('🧪 Source files were changed but no tests were added or updated. Consider adding tests.');
}

// =============================================================================
// 8. TODO/FIXME CHECK
// =============================================================================
let todoCount = 0;
Promise.all(
  allFiles
    .filter((f) => /\.(tsx|ts|jsx|js)$/.test(f))
    .map(async (file) => {
      const lines = await getAddedLines(file);

      lines.forEach((line) => {
        if (CONFIG.forbiddenPatterns.todoComments.test(line)) {
          todoCount++;
        }
      });
    })
).then(() => {
  if (todoCount > CONFIG.maxTodos) {
    warn(`📝 ${todoCount} new TODO/FIXME comments added. Consider creating GitHub issues instead.`);
  }
});

// =============================================================================
// 9. DOCUMENTATION CHECK
// =============================================================================
const hasApiChanges = allFiles.some(
  (f) => f.includes('api') || f.includes('supabase/functions') || f.endsWith('.d.ts')
);

const hasDocChanges = allFiles.some((f) => f.endsWith('.md'));

if (hasApiChanges && !hasDocChanges) {
  warn('📚 API changes detected but no documentation updates. Please update docs.');
}

// Check if README needs updating
if (createdFiles.some((f) => f.startsWith('src/pages/') || f.startsWith('src/projects/'))) {
  message('📄 New pages/projects added. Consider updating README.md if needed.');
}

// =============================================================================
// 10. DEPENDENCIES CHECK
// =============================================================================
const packageChanged = allFiles.includes('package.json');
const lockFileChanged = allFiles.includes('package-lock.json');

if (packageChanged && !lockFileChanged) {
  fail('📦 `package.json` was modified but `package-lock.json` was not. Run `npm install`.');
}

if (packageChanged) {
  message('📦 Dependencies changed. Remember to run `npm audit` to check for vulnerabilities.');
}

// =============================================================================
// 11. TYPESCRIPT CHECKS
// =============================================================================
const tsFiles = allFiles.filter((f) => /\.(ts|tsx)$/.test(f));

if (tsFiles.length > 0) {
  Promise.all(
    tsFiles.map(async (file) => {
      const lines = await getAddedLines(file);

      lines.forEach((line) => {
        // Check for 'any' types
        if (/:\s*any\b/.test(line) || /as\s+any\b/.test(line)) {
          warn(`⚠️ 'any' type used in \`${file}\`. Consider using a more specific type.`);
        }

        // Check for @ts-ignore
        if (/@ts-ignore/.test(line)) {
          warn(
            `⚠️ @ts-ignore used in \`${file}\`. Address the underlying TypeScript issue instead.`
          );
        }
      });
    })
  );
}

// =============================================================================
// 12. ACCESSIBILITY CHECKS
// =============================================================================
Promise.all(
  allFiles
    .filter((f) => /\.(tsx|jsx)$/.test(f))
    .map(async (file) => {
      const lines = await getAddedLines(file);

      lines.forEach((line) => {
        // Check for images without alt text
        if (/<img/.test(line) && !/alt=/.test(line)) {
          warn(`♿ Image without alt text in \`${file}\`. Add alt text for accessibility.`);
        }

        // Check for onClick without keyboard handler
        if (/onClick/.test(line) && !/onKeyDown|onKeyPress|onKeyUp/.test(line)) {
          message(`⌨️ onClick handler in \`${file}\` - ensure keyboard accessibility is handled.`);
        }
      });
    })
);

// =============================================================================
// 13. FINAL SUMMARY
// =============================================================================
const errors = danger.fails.length;
const warnings = danger.warnings.length;
const messages = danger.messages.length;

markdown(`
## 🤖 Automated PR Review Summary

| Check | Status |
|-------|--------|
| PR Size | ${prSize < 500 ? '✅' : prSize < 1000 ? '⚠️' : '❌'} ${prSize} lines |
| Semantic Commit | ${hasSemanticPrefix ? '✅' : '❌'} |
| Design System | ${errors === 0 ? '✅ Compliant' : '❌ Violations found'} |
| Security | ${!allFiles.includes('.env') ? '✅ Secure' : '❌ Issues found'} |
| Tests | ${hasTests || !hasSourceChanges ? '✅' : '⚠️'} |
| Documentation | ${hasDocChanges || !hasApiChanges ? '✅' : '⚠️'} |

**Results:**
- 🚫 **Errors:** ${errors} (must fix)
- ⚠️ **Warnings:** ${warnings} (should fix)
- 💬 **Messages:** ${messages} (informational)

${errors > 0 ? '**❌ This PR has blocking issues that must be resolved before merging.**' : '**✅ This PR passes all required checks!**'}
`);
