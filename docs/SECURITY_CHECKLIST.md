# Security Checklist

> Last verified: 2025-12-09

---

## Overview

This checklist provides a comprehensive security audit guide for pre-deployment
reviews of the Alawein Platform.

---

## Pre-Deployment Security Audit

### Authentication & Authorization

- [ ] **Password Requirements**
  - Minimum 8 characters enforced
  - Complexity requirements (uppercase, lowercase, numbers, symbols)
  - Password strength indicator implemented

- [ ] **Session Management**
  - Session tokens are securely generated
  - Session timeout configured appropriately
  - Secure cookie flags set (HttpOnly, Secure, SameSite)

- [ ] **Multi-Factor Authentication**
  - MFA option available for sensitive operations
  - Recovery codes properly generated and stored

- [ ] **OAuth/Social Login**
  - OAuth providers properly configured
  - Token validation implemented
  - Scope permissions minimized

---

### Database Security

- [ ] **Row Level Security (RLS)**
  - RLS enabled on all user data tables
  - Policies tested for all CRUD operations
  - No overly permissive policies (avoid `true` conditions)

- [ ] **Data Access Controls**
  - User can only access their own data
  - Admin roles properly restricted
  - Service role key never exposed to client

- [ ] **Sensitive Data**
  - PII fields identified and protected
  - Encryption at rest enabled
  - Data retention policies defined

- [ ] **SQL Injection Prevention**
  - Parameterized queries used throughout
  - No raw SQL with user input
  - Input sanitization implemented

---

### API Security

- [ ] **Endpoint Protection**
  - All endpoints require authentication (unless intentionally public)
  - Rate limiting implemented
  - Request size limits configured

- [ ] **CORS Configuration**
  - Allowed origins explicitly defined
  - Credentials handling properly configured
  - Preflight caching optimized

- [ ] **Input Validation**
  - All inputs validated with Zod schemas
  - URL parameters properly encoded
  - File uploads validated (type, size, content)

- [ ] **Error Handling**
  - Generic error messages for clients
  - Detailed errors logged server-side only
  - No stack traces in production responses

---

### Frontend Security

- [ ] **XSS Prevention**
  - User content properly escaped
  - DOMPurify used for HTML sanitization
  - CSP headers configured

- [ ] **CSRF Protection**
  - Anti-CSRF tokens implemented
  - SameSite cookie attribute set
  - Origin validation on sensitive requests

- [ ] **Sensitive Data Handling**
  - No secrets in client-side code
  - Environment variables properly prefixed (VITE\_)
  - LocalStorage usage reviewed for sensitive data

- [ ] **Dependency Security**
  - npm audit run with zero vulnerabilities
  - Dependencies regularly updated
  - No deprecated packages in use

---

### Infrastructure Security

- [ ] **Environment Configuration**
  - Production secrets properly managed
  - Development secrets separated
  - No hardcoded credentials

- [ ] **HTTPS/TLS**
  - TLS 1.2+ enforced
  - Valid SSL certificates
  - HTTP to HTTPS redirect configured

- [ ] **Headers Security**
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Strict-Transport-Security enabled
  - Content-Security-Policy configured

- [ ] **Logging & Monitoring**
  - Security events logged
  - Audit trail for sensitive operations
  - Alerting configured for anomalies

---

### Edge Functions Security

- [ ] **Authentication Verification**

  ```typescript
  // Required pattern for protected endpoints
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }
  ```

- [ ] **Input Validation**

  ```typescript
  // Validate all incoming data
  const schema = z.object({
    id: z.string().uuid(),
    action: z.enum(['create', 'update', 'delete']),
  });
  const result = schema.safeParse(body);
  if (!result.success) {
    return new Response('Invalid input', { status: 400 });
  }
  ```

- [ ] **Rate Limiting**
  - Request throttling implemented
  - IP-based limiting for public endpoints
  - User-based limiting for authenticated endpoints

---

### File Storage Security

- [ ] **Upload Validation**
  - File type whitelist enforced
  - File size limits configured
  - Content validation (magic bytes)

- [ ] **Access Control**
  - Storage buckets properly configured
  - RLS policies on storage.objects
  - Signed URLs with expiration

- [ ] **Malware Prevention**
  - File scanning consideration
  - Executable files blocked
  - Archive contents validated

---

## Security Testing Checklist

### Automated Testing

- [ ] Run `npm audit` - no high/critical vulnerabilities
- [ ] Run `npx tsc --noEmit` - no type errors
- [ ] Run security linter rules
- [ ] Dependency vulnerability scan

### Manual Testing

- [ ] Test authentication flows
- [ ] Verify authorization on all endpoints
- [ ] Test input validation edge cases
- [ ] Verify error handling doesn't leak info

### Penetration Testing

- [ ] SQL injection attempts
- [ ] XSS injection attempts
- [ ] CSRF attack simulation
- [ ] Authentication bypass attempts

---

## Incident Response Checklist

### Immediate Actions

- [ ] Identify affected systems
- [ ] Isolate compromised components
- [ ] Preserve evidence/logs
- [ ] Notify security team

### Investigation

- [ ] Determine attack vector
- [ ] Assess data exposure
- [ ] Review affected user accounts
- [ ] Document timeline

### Recovery

- [ ] Patch vulnerability
- [ ] Reset affected credentials
- [ ] Restore from clean backup
- [ ] Update security measures

### Communication

- [ ] Notify affected users
- [ ] Report to authorities if required
- [ ] Document lessons learned
- [ ] Update security policies

---

## Security Review Schedule

| Review Type          | Frequency | Responsible      |
| -------------------- | --------- | ---------------- |
| Dependency audit     | Weekly    | DevOps           |
| Code security review | Per PR    | Reviewers        |
| Penetration testing  | Quarterly | Security Team    |
| Full security audit  | Annually  | External Auditor |

---

## Quick Reference Commands

```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Check for outdated packages
npm outdated

# Run security linter
npm run lint

# Type check
npx tsc --noEmit
```

---

## Related Documentation

- [SECURITY.md](../SECURITY.md) - Security policy and reporting
- [docs/SECURITY.md](./SECURITY.md) - Security best practices
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guidelines
- [API_DESIGN.md](./API_DESIGN.md) - API security patterns
