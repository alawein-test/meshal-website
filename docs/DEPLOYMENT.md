# Production Deployment Guide

> Last verified: 2025-12-09

---

## Table of Contents

1. Overview
2. Prerequisites
3. Deployment Options
4. Environment Configuration
5. Pre-deployment Checklist
6. Step-by-Step Deployment
7. Post-deployment Verification
8. Rollback Procedures
9. Monitoring & Alerts
10. Troubleshooting

---

## Overview

The Alawein Platform supports multiple deployment targets. This guide covers
production deployment best practices and step-by-step instructions.

### Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   CDN/Edge      │────▶│   Frontend      │────▶│   Backend       │
│   (Cloudflare)  │     │   (Static SPA)  │     │   (Lovable Cloud)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                                               ┌─────────────────┐
                                               │   Database      │
                                               │   (PostgreSQL)  │
                                               └─────────────────┘
```

---

## Prerequisites

### Required Tools

```bash
# Node.js 20.x or higher
node --version  # v20.x.x

# npm 10.x or higher
npm --version   # 10.x.x

# Git
git --version
```

### Access Requirements

- [ ] Repository write access
- [ ] Lovable account with publish permissions
- [ ] DNS management access (for custom domains)
- [ ] Environment secrets access

---

## Deployment Options

### Option 1: Lovable (Recommended)

**Best for:** Quick deployments, automatic SSL, CDN included

1. Click **Publish** in Lovable interface
2. Click **Update** to deploy frontend changes
3. Backend changes (edge functions, migrations) deploy automatically

**Features:**

- Automatic HTTPS/SSL
- Global CDN
- Automatic builds
- Preview deployments
- Custom domain support

### Option 2: Vercel

**Best for:** Advanced CI/CD, serverless functions, team collaboration

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel deploy --prod
```

**vercel.json configuration:**

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### Option 3: Netlify

**Best for:** JAMstack, form handling, split testing

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=dist
```

**netlify.toml configuration:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

### Option 4: Docker

**Best for:** Self-hosted, Kubernetes, container orchestration

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Build and run
docker build -t alawein-platform .
docker run -p 80:80 alawein-platform
```

---

## Environment Configuration

### Required Variables

| Variable                        | Description        | Required |
| ------------------------------- | ------------------ | -------- |
| `VITE_SUPABASE_URL`             | Backend API URL    | ✅       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key     | ✅       |
| `VITE_SUPABASE_PROJECT_ID`      | Project identifier | ✅       |

### Optional Variables

| Variable                | Description        | Default      |
| ----------------------- | ------------------ | ------------ |
| `VITE_APP_ENV`          | Environment name   | `production` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics   | `true`       |
| `VITE_SENTRY_DSN`       | Error tracking DSN | -            |

### Setting Environment Variables

**Lovable:** Automatically configured via Lovable Cloud

**Vercel:**

```bash
vercel env add VITE_SUPABASE_URL production
```

**Netlify:**

```bash
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
```

**Docker:**

```bash
docker run -e VITE_SUPABASE_URL=... -p 80:80 alawein-platform
```

---

## Pre-deployment Checklist

### Code Quality

- [ ] All tests pass: `npm run test`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`

### Security

- [ ] No hardcoded secrets in code
- [ ] Environment variables configured
- [ ] RLS policies reviewed
- [ ] CORS settings verified
- [ ] Security headers configured

### Performance

- [ ] Bundle size analyzed: `npm run build -- --report`
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Code splitting verified

### Documentation

- [ ] CHANGELOG.md updated
- [ ] Version number bumped
- [ ] API documentation current
- [ ] README.md updated

---

## Step-by-Step Deployment

### 1. Prepare Release

```bash
# Ensure on main branch
git checkout main
git pull origin main

# Run all checks
npm run lint
npm run test
npm run build

# Bump version
npm version minor  # or patch/major
```

### 2. Create Release Tag

```bash
# Create annotated tag
git tag -a v1.2.0 -m "Release v1.2.0"

# Push tag
git push origin v1.2.0
```

### 3. Deploy

**Lovable:**

1. Open project in Lovable
2. Click **Publish** button
3. Click **Update** to deploy
4. Verify deployment URL

**Vercel/Netlify:**

```bash
# Automatic deployment on push to main
git push origin main
```

### 4. Verify Deployment

```bash
# Check deployment status
curl -I https://your-app.lovable.app

# Run smoke tests
npm run test:e2e -- --grep "smoke"
```

---

## Post-deployment Verification

### Smoke Tests

1. **Homepage loads** - Check main route renders
2. **Authentication works** - Test login/logout flow
3. **API connectivity** - Verify backend calls succeed
4. **Static assets** - Confirm images/fonts load
5. **PWA functionality** - Test offline mode

### Performance Checks

```bash
# Lighthouse audit
npx lighthouse https://your-app.lovable.app --output html

# Web Vitals
# Check Core Web Vitals in browser DevTools
```

### Monitoring Setup

- [ ] Error tracking active (Sentry/LogRocket)
- [ ] Analytics tracking (if enabled)
- [ ] Uptime monitoring configured
- [ ] Alert thresholds set

---

## Rollback Procedures

### Immediate Rollback (Lovable)

1. Go to project settings
2. Access version history
3. Restore previous version
4. Re-publish

### Rollback via Git

```bash
# Revert to previous release
git revert HEAD
git push origin main

# Or reset to specific tag
git checkout v1.1.0
git push -f origin main  # ⚠️ Use with caution
```

### Database Rollback

```sql
-- Check migration history
SELECT * FROM supabase_migrations ORDER BY executed_at DESC;

-- Manual rollback may be required for data changes
-- Always test in staging first
```

---

## Monitoring & Alerts

### Health Endpoints

```typescript
// Recommended health check endpoint
// Add to edge function
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.VITE_APP_VERSION,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
```

### Recommended Monitoring

| Metric          | Tool        | Threshold |
| --------------- | ----------- | --------- |
| Uptime          | UptimeRobot | 99.9%     |
| Response time   | Pingdom     | < 500ms   |
| Error rate      | Sentry      | < 0.1%    |
| Core Web Vitals | PageSpeed   | Green     |

---

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
rm -rf dist
npm ci
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart build after changes
- Check variable escaping in shell

### 404 Errors on Refresh

Configure SPA routing (see deployment option configs above).

### CORS Errors

Check backend CORS configuration allows your deployment domain.

### SSL Certificate Issues

- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check certificate auto-renewal

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [TESTING.md](./TESTING.md) - Testing guide
- [SECURITY.md](./SECURITY.md) - Security practices
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [deployment/README.md](./deployment/README.md) - Quick reference
