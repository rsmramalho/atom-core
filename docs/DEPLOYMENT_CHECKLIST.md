# MindMate Production Deployment Checklist

## Pre-Deployment Checklist

Use this checklist before every production release to ensure a smooth deployment.

---

## 1. Code Quality

- [ ] All tests passing (`npm run test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No console.log statements in production code
- [ ] No hardcoded API keys or secrets
- [ ] Code reviewed and approved

---

## 2. Database & Backend

### Supabase Configuration

- [ ] All migrations applied to production database
- [ ] RLS (Row Level Security) enabled on all tables
- [ ] RLS policies tested with different user roles
- [ ] Database indexes optimized for common queries
- [ ] Backup strategy in place

### Tables Checklist

| Table | RLS Enabled | Policies Verified |
|-------|-------------|-------------------|
| `items` | ☐ | ☐ |
| `onboarding_progress` | ☐ | ☐ |
| `onboarding_analytics` | ☐ | ☐ |

### Edge Functions

- [ ] All edge functions deployed
- [ ] Edge function secrets configured
- [ ] CORS headers properly set
- [ ] Error handling implemented

---

## 3. Authentication

- [ ] Email confirmation enabled (production)
- [ ] Password reset flow tested
- [ ] Session management configured
- [ ] Auth redirect URLs updated for production domain
- [ ] OAuth providers configured (if applicable)

### Supabase Auth Settings

```
Dashboard → Authentication → URL Configuration
- Site URL: https://your-production-domain.com
- Redirect URLs: https://your-production-domain.com/**
```

---

## 4. Environment Variables

### Required Variables

| Variable | Set | Verified |
|----------|-----|----------|
| `VITE_SUPABASE_URL` | ☐ | ☐ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ☐ | ☐ |
| `VITE_SUPABASE_PROJECT_ID` | ☐ | ☐ |

### Security Check

- [ ] No secrets in client-side code
- [ ] `.env` not committed to repository
- [ ] Production keys are different from development

---

## 5. Performance

- [ ] Images optimized and compressed
- [ ] Lazy loading implemented for routes
- [ ] Bundle size analyzed (`npm run build`)
- [ ] No memory leaks in components
- [ ] API calls optimized (no N+1 queries)

### Bundle Size Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Initial JS | < 200KB | ___KB |
| Total JS | < 500KB | ___KB |
| CSS | < 50KB | ___KB |

---

## 6. Security

- [ ] HTTPS enabled
- [ ] Content Security Policy configured
- [ ] XSS protection verified
- [ ] SQL injection prevented (using Supabase client)
- [ ] Sensitive data encrypted
- [ ] Rate limiting configured (if applicable)

### Security Headers (verify in response)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## 7. SEO & Accessibility

- [ ] Meta tags configured
- [ ] Open Graph tags set
- [ ] Favicon and app icons added
- [ ] robots.txt configured
- [ ] sitemap.xml generated (if applicable)
- [ ] Alt text on all images
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility tested

---

## 8. Monitoring & Analytics

- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics installed (if applicable)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Log aggregation set up

---

## 9. User Experience

- [ ] Loading states implemented
- [ ] Error states handled gracefully
- [ ] Empty states display correctly
- [ ] Offline behavior defined
- [ ] Mobile responsiveness verified

### Device Testing

| Device | Tested | Issues |
|--------|--------|--------|
| Desktop Chrome | ☐ | |
| Desktop Firefox | ☐ | |
| Desktop Safari | ☐ | |
| Mobile iOS | ☐ | |
| Mobile Android | ☐ | |
| Tablet | ☐ | |

---

## 10. Documentation

- [ ] README updated
- [ ] CHANGELOG updated with version
- [ ] API documentation current
- [ ] User documentation ready
- [ ] Support contact information available

---

## Deployment Steps

### 1. Final Verification

```bash
# Run full test suite
npm run test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### 2. Create Release Tag

```bash
git tag -a v4.0.0 -m "Production release v4.0.0"
git push origin v4.0.0
```

### 3. Deploy

**Lovable Deployment:**
1. Click "Publish" button in Lovable editor
2. Verify deployment URL
3. Test production site

**Custom Hosting:**
```bash
# Build
npm run build

# Deploy dist folder to your hosting provider
```

### 4. Post-Deployment Verification

- [ ] Production site loads correctly
- [ ] Authentication works
- [ ] Core features functional
- [ ] No console errors
- [ ] Performance acceptable

---

## Rollback Plan

If issues arise after deployment:

### Immediate Rollback

1. **Lovable**: Use version history to restore previous version
2. **Git**: Revert to previous tag
   ```bash
   git checkout v4.0.0-rc.1
   ```

### Database Rollback

- Keep migration rollback scripts ready
- Document manual steps if needed
- Test rollback in staging first

---

## Post-Deployment Tasks

- [ ] Monitor error rates for 24 hours
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Update status page (if applicable)
- [ ] Notify stakeholders of successful deployment
- [ ] Archive deployment notes

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| Lead Developer | |
| DevOps | |
| Product Owner | |

---

## Version History

| Version | Date | Deployed By | Notes |
|---------|------|-------------|-------|
| v4.0.0-rc.1 | Dec 2024 | | Milestone release |
| | | | |

---

*Last updated: December 2024*
