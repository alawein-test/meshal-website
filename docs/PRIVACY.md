# Privacy Policy

> Data collection, storage, and user privacy rights for MA Digital Studios
> Platform

## Overview

This document outlines how the MA Digital Studios platform handles user data,
privacy practices, and user rights regarding their personal information.

---

## Data Collection

### What We Collect

| Data Type               | Purpose                              | Retention              |
| ----------------------- | ------------------------------------ | ---------------------- |
| **Email Address**       | Authentication, notifications        | Until account deletion |
| **Profile Information** | User identification, personalization | Until account deletion |
| **Usage Analytics**     | Platform improvement, debugging      | 90 days (anonymized)   |
| **Session Data**        | Authentication state                 | Session duration       |
| **Project Data**        | Core functionality                   | Until user deletion    |

### What We Don't Collect

- ❌ Payment information (handled by third-party processors)
- ❌ Location data beyond timezone
- ❌ Device identifiers for tracking
- ❌ Third-party social media data
- ❌ Biometric data

---

## Data Storage

### Storage Infrastructure

```
┌─────────────────────────────────────────────────────────┐
│                    Data Architecture                     │
├─────────────────────────────────────────────────────────┤
│  User Data          → Encrypted PostgreSQL Database     │
│  File Uploads       → Secure Cloud Storage (encrypted)  │
│  Session Tokens     → HttpOnly Secure Cookies           │
│  API Keys           → Encrypted Secrets Manager         │
└─────────────────────────────────────────────────────────┘
```

### Encryption Standards

- **At Rest**: AES-256 encryption for all stored data
- **In Transit**: TLS 1.3 for all network communications
- **Passwords**: bcrypt hashing with salt (cost factor 12+)
- **Tokens**: Cryptographically secure random generation

### Data Residency

- Primary data center: Cloud-hosted infrastructure
- Backups: Encrypted and geographically distributed
- No data sold or shared with third parties for marketing

---

## User Rights

### Access Your Data

Users can access their data through:

1. **Profile Settings** - View and edit personal information
2. **Export Feature** - Download all personal data in JSON format
3. **API Access** - Programmatic access to user-owned data

### Right to Rectification

Users can update or correct their personal information at any time through:

- Account settings page
- Profile management section
- Contacting support for bulk corrections

### Right to Erasure (Right to be Forgotten)

Users can request complete data deletion:

```markdown
## Data Deletion Process

1. Navigate to Settings → Account → Delete Account
2. Confirm deletion request via email
3. 30-day grace period for account recovery
4. Complete data purge after grace period
5. Confirmation email sent upon completion
```

### Data Portability

Export your data in standard formats:

- **JSON** - Complete structured data export
- **CSV** - Tabular data for spreadsheets
- **PDF** - Human-readable reports

---

## Cookies and Tracking

### Essential Cookies

| Cookie             | Purpose        | Duration |
| ------------------ | -------------- | -------- |
| `session_token`    | Authentication | Session  |
| `csrf_token`       | Security       | Session  |
| `theme_preference` | UI preference  | 1 year   |

### Analytics (Opt-In)

- Anonymous usage statistics
- No cross-site tracking
- No advertising cookies
- User can opt-out anytime

### Third-Party Services

We use the following third-party services:

| Service  | Purpose         | Privacy Policy                                                             |
| -------- | --------------- | -------------------------------------------------------------------------- |
| Supabase | Database & Auth | [supabase.com/privacy](https://supabase.com/privacy)                       |
| Vercel   | Hosting         | [vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy) |

---

## Data Breach Response

### Notification Timeline

```
Breach Detected → 24 hours → Internal Assessment
                → 48 hours → Affected Users Notified
                → 72 hours → Regulatory Bodies Notified (if required)
```

### Response Actions

1. Immediate containment of breach
2. Forensic investigation
3. User notification with details
4. Remediation steps provided
5. Post-incident report published

---

## Children's Privacy

- Platform not intended for users under 13
- No knowing collection of children's data
- Immediate deletion upon discovery
- Parental notification if applicable

---

## Policy Updates

### Notification Process

- Email notification 30 days before changes
- In-app banner announcing updates
- Changelog of modifications provided
- Continued use implies acceptance

### Version History

| Version | Date       | Changes                       |
| ------- | ---------- | ----------------------------- |
| 1.0.0   | 2024-01-01 | Initial policy                |
| 1.1.0   | 2024-06-01 | Added GDPR compliance details |
| 1.2.0   | 2024-12-01 | Updated third-party services  |

---

## Contact

For privacy-related inquiries:

- **Email**: privacy@madigitalstudios.com
- **Response Time**: Within 5 business days
- **Data Protection Officer**: Available upon request

---

## Compliance

This privacy policy is designed to comply with:

- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **PIPEDA** (Personal Information Protection and Electronic Documents Act)

---

## Related Documents

- [Security Policy](./SECURITY.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- Terms of Service (Coming Soon)
