# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow responsible disclosure practices.

### How to Report

**DO NOT** open a public issue for security vulnerabilities.

Instead, please report vulnerabilities via one of these methods:

1. **Email**: Send details to `security@your-domain.com`
2. **GitHub Security Advisory**: Use [GitHub's private vulnerability reporting](https://github.com/YOUR_USERNAME/YOUR_REPO/security/advisories/new)

### What to Include

Please provide:

- **Description**: Clear explanation of the vulnerability
- **Impact**: What an attacker could achieve
- **Steps to Reproduce**: Detailed reproduction steps
- **Affected Versions**: Which versions are impacted
- **Suggested Fix**: If you have recommendations

### Example Report

```markdown
## Vulnerability: [Brief Title]

### Description
[Clear description of the security issue]

### Impact
- Severity: [Critical/High/Medium/Low]
- Attack Vector: [Network/Local/Physical]
- Affected Component: [Engine/API/Database/Auth]

### Steps to Reproduce
1. ...
2. ...
3. ...

### Environment
- Version: 4.0.0-rc.1
- Browser: Chrome 120
- OS: macOS 14

### Suggested Fix
[Your recommendations, if any]
```

## Response Timeline

| Action | Timeframe |
|--------|-----------|
| Initial Response | 48 hours |
| Vulnerability Assessment | 7 days |
| Fix Development | 14-30 days (varies by severity) |
| Public Disclosure | After fix is deployed |

## Security Measures

### Authentication & Authorization

- All routes require authentication (except login/signup)
- Row Level Security (RLS) enabled on all database tables
- JWT tokens for session management
- Passwords hashed with bcrypt via Supabase Auth

### Data Protection

- All data encrypted in transit (HTTPS)
- Database encryption at rest
- User data isolated via RLS policies
- No sensitive data in client-side storage

### Input Validation

- Server-side validation on all inputs
- SQL injection prevented via Supabase client
- XSS prevention through React's default escaping
- CSRF protection via SameSite cookies

### Infrastructure

- Hosted on Lovable Cloud (Supabase infrastructure)
- Automatic security updates
- Regular backups
- DDoS protection

## Security Best Practices for Contributors

### Code Guidelines

```typescript
// ✅ DO: Use parameterized queries via Supabase client
const { data } = await supabase
  .from('items')
  .select('*')
  .eq('user_id', userId);

// ❌ DON'T: Construct raw SQL queries
// const query = `SELECT * FROM items WHERE user_id = '${userId}'`;
```

```typescript
// ✅ DO: Validate user input with Zod
import { z } from 'zod';

const itemSchema = z.object({
  title: z.string().min(1).max(255),
  notes: z.string().max(10000).optional(),
});

// ❌ DON'T: Trust user input directly
// const title = userInput.title;
```

```typescript
// ✅ DO: Use design system tokens
<div className="bg-background text-foreground">

// ❌ DON'T: Use dangerouslySetInnerHTML with user content
// <div dangerouslySetInnerHTML={{ __html: userContent }} />
```

### Checklist for PRs

- [ ] No hardcoded secrets or API keys
- [ ] RLS policies cover new tables
- [ ] Input validation implemented
- [ ] No sensitive data logged
- [ ] Authentication required for sensitive operations

## Known Security Considerations

### Client-Side Storage

- Local storage used for UI preferences only
- No sensitive data stored client-side
- Session tokens managed by Supabase

### Third-Party Dependencies

- Dependencies regularly audited
- Automated security updates via Dependabot
- Minimal dependency footprint

## Acknowledgments

We appreciate security researchers who help keep MindMate safe. Contributors who responsibly disclose vulnerabilities will be acknowledged (with permission) in our security hall of fame.

## Contact

- **Security Issues**: security@your-domain.com
- **General Support**: support@your-domain.com
- **Documentation**: [CONTRIBUTING.md](docs/CONTRIBUTING.md)

---

*Last updated: December 2024*
