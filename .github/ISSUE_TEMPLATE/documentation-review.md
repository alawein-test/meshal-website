---
name: Quarterly Documentation Review
about: Scheduled documentation audit and maintenance
title: '[DOCS] Quarterly Documentation Review - Q[X] 20XX'
labels: documentation, maintenance
assignees: ''
---

## 📚 Quarterly Documentation Review

**Review Period**: Q[X] 20XX **Due Date**: [End of quarter] **Last Review**:
[Previous quarter date]

---

## Pre-Review Checklist

- [ ] Run validation script: `node scripts/validate-docs.js --verbose`
- [ ] Review CI validation reports from past quarter
- [ ] Check for new features added since last review

---

## Documentation Accuracy Audit

### Core Documentation

| Doc                                           | Verified | Issues Found | Fixed |
| --------------------------------------------- | -------- | ------------ | ----- |
| [QUICK_START.md](../../docs/QUICK_START.md)   | ☐        |              | ☐     |
| [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) | ☐        |              | ☐     |
| [STRUCTURE.md](../../docs/STRUCTURE.md)       | ☐        |              | ☐     |
| [DEVELOPMENT.md](../../docs/DEVELOPMENT.md)   | ☐        |              | ☐     |

### Technical Reference

| Doc                                             | Verified | Issues Found | Fixed |
| ----------------------------------------------- | -------- | ------------ | ----- |
| [ROUTING.md](../../docs/ROUTING.md)             | ☐        |              | ☐     |
| [ERD.md](../../docs/ERD.md)                     | ☐        |              | ☐     |
| [API_REFERENCE.md](../../docs/API_REFERENCE.md) | ☐        |              | ☐     |
| [MODULES.md](../../docs/MODULES.md)             | ☐        |              | ☐     |

### UI & Design

| Doc                                             | Verified | Issues Found | Fixed |
| ----------------------------------------------- | -------- | ------------ | ----- |
| [UI_COMPONENTS.md](../../docs/UI_COMPONENTS.md) | ☐        |              | ☐     |
| [DESIGN_SYSTEM.md](../../docs/DESIGN_SYSTEM.md) | ☐        |              | ☐     |
| [WIREFRAMES.md](../../docs/WIREFRAMES.md)       | ☐        |              | ☐     |
| [BRAND_ASSETS.md](../../docs/BRAND_ASSETS.md)   | ☐        |              | ☐     |

### Testing & Deployment

| Doc                                                 | Verified | Issues Found | Fixed |
| --------------------------------------------------- | -------- | ------------ | ----- |
| [TESTING.md](../../docs/TESTING.md)                 | ☐        |              | ☐     |
| [deployment/README.md](../../README.md)             | ☐        |              | ☐     |
| [SECURITY.md](../../SECURITY.md)                    | ☐        |              | ☐     |
| [TROUBLESHOOTING.md](../../docs/TROUBLESHOOTING.md) | ☐        |              | ☐     |

### AI & Automation

| Doc                                   | Verified | Issues Found | Fixed |
| ------------------------------------- | -------- | ------------ | ----- |
| [AI_GUIDE.md](../../docs/AI_GUIDE.md) | ☐        |              | ☐     |
| [CLAUDE.md](../../CLAUDE.md)          | ☐        |              | ☐     |
| [AUGMENT.md](../../AUGMENT.md)        | ☐        |              | ☐     |

---

## Validation Tasks

### 1. Link Verification

```bash
node scripts/validate-docs.js --ci
```

- [ ] All internal links working
- [ ] All external links accessible
- [ ] All image/asset references valid

### 2. Code Example Testing

- [ ] Quick Start installation steps work
- [ ] API examples use correct endpoints
- [ ] Component examples compile without errors
- [ ] Edge function examples are current

### 3. Route Verification

- [ ] All documented routes exist in `src/App.tsx`
- [ ] No undocumented routes exist
- [ ] Route descriptions match actual pages

### 4. Database Schema Check

- [ ] ERD matches `src/integrations/supabase/types.ts`
- [ ] All tables documented
- [ ] RLS policies accurately described

---

## Content Freshness

### Update "Last Verified" Dates

After verification, update the `> Last verified:` line in each doc:

```markdown
> Last verified: YYYY-MM-DD
```

- [ ] All verified docs have updated dates

---

## New Documentation Needed

List any new features or changes that need documentation:

1.
2.
3.

---

## Deprecated Content

List any documentation that should be archived or removed:

1.
2.

---

## Action Items

| Task | Assignee | Due Date | Status |
| ---- | -------- | -------- | ------ |
|      |          |          | ☐      |
|      |          |          | ☐      |
|      |          |          | ☐      |

---

## Review Completion

- [ ] All docs verified and updated
- [ ] Validation script passes
- [ ] Freshness dates updated
- [ ] New documentation created
- [ ] Deprecated content archived
- [ ] PR submitted with changes

**Reviewer**: **Completion Date**: **Next Review**: Q[X+1] 20XX
