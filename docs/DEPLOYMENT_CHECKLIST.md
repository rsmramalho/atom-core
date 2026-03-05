# MindMate Production Deployment Checklist

## Version: 4.0.0-beta.0
## Last Updated: 2026-03-05

Use this checklist before every production release to ensure a smooth deployment.

---

## 1. Code Quality

- [ ] All unit tests passing (`npm run test`)
- [ ] E2E tests passing (`npx playwright test`)
- [ ] Visual regression tests verified
- [ ] Build without errors (`npm run build`)
- [ ] No TypeScript errors in strict mode
- [ ] No console.log statements in production code
- [ ] No hardcoded API keys or secrets
- [ ] Code reviewed and approved

---

## 2. PWA & Service Worker Verification ⭐

### Build Artifacts Check

After running `npm run build`, verify:

```bash
# Required PWA files
ls -la dist/sw.js                    # Service Worker (required)
ls -la dist/manifest.webmanifest     # PWA Manifest (required)
ls -la dist/workbox-*.js             # Workbox runtime (required)
ls -la dist/pwa-icons/               # PWA icons directory
```

### Service Worker Checklist

- [ ] `dist/sw.js` exists and size > 1KB
- [ ] `dist/workbox-*.js` files generated
- [ ] No SW registration errors in console

### PWA Manifest Checklist

Verify `dist/manifest.webmanifest` contains:
- [ ] `name`: "MindMate - Atom Engine"
- [ ] `short_name`: "MindMate"
- [ ] `start_url`: "/"
- [ ] `display`: "standalone"
- [ ] `theme_color`: defined
- [ ] `background_color`: defined
- [ ] `icons`: array with 72, 96, 128, 144, 152, 192, 384, 512 sizes

### PWA Icons Check

```bash
# All required icon sizes present
ls dist/pwa-icons/
# Expected: icon-72x72.png, icon-96x96.png, icon-128x128.png, 
#           icon-144x144.png, icon-152x152.png, icon-192x192.png,
#           icon-384x384.png, icon-512x512.png
```

### Lighthouse PWA Audit

1. Open Chrome DevTools > Lighthouse
2. Select "Progressive Web App" category
3. Run audit

**Required scores:**
- [ ] PWA Score ≥ 90
- [ ] Installable: ✅
- [ ] PWA Optimized: ✅

### DevTools Verification

**Application > Service Workers:**
- [ ] Status: "activated and is running"
- [ ] Scope: "/" (root)
- [ ] No errors in registration

**Application > Manifest:**
- [ ] Identity section populated
- [ ] Presentation section correct
- [ ] Icons loaded correctly
- [ ] No warnings/errors

**Application > Cache Storage:**
- [ ] `workbox-precache-*` cache exists
- [ ] Assets are cached

---

## 3. Offline Functionality

### Network Offline Test

1. DevTools > Network > Offline checkbox
2. Refresh page

**Verify:**
- [ ] App loads from cache
- [ ] Offline indicator displayed
- [ ] Basic navigation works
- [ ] Cached data visible

### Sync Queue Test

1. Go offline
2. Perform action (complete task, etc.)
3. Check pending indicator visible
4. Go online
5. Verify sync completes

- [ ] Operations queued correctly
- [ ] Pending badge shows count
- [ ] Auto-sync on reconnect
- [ ] Toast notification on sync complete

---

## 4. Database & Backend

### Supabase Configuration

- [ ] All migrations applied to production database
- [ ] RLS (Row Level Security) enabled on all tables
- [ ] RLS policies tested with different user roles
- [ ] Database indexes optimized for common queries

### Tables Checklist

| Table | RLS Enabled | Policies Verified |
|-------|-------------|-------------------|
| `items` | ☐ | ☐ |
| `profiles` | ☐ | ☐ |
| `project_members` | ☐ | ☐ |
| `project_invites` | ☐ | ☐ |
| `project_activities` | ☐ | ☐ |
| `push_subscriptions` | ☐ | ☐ |
| `onboarding_progress` | ☐ | ☐ |
| `onboarding_analytics` | ☐ | ☐ |

### Cascade Deletes

- [ ] Deleting a project cascades to `project_members`
- [ ] Deleting a project cascades to `project_invites`
- [ ] Deleting a project cascades to `project_activities`

### Profiles Auto-Create

- [ ] Trigger `on_auth_user_created` fires on new signup
- [ ] Profile row created with correct `id` and `email`

### Edge Functions

- [ ] `send-push-notification` deployed and functional
- [ ] `check-due-tasks` deployed with cron schedule
- [ ] `weekly-summary` deployed with AI model access
- [ ] Edge function secrets configured (VAPID keys, etc.)
- [ ] CORS headers properly set
- [ ] Error handling implemented

### Push Notifications

- [ ] VAPID public/private keys configured as secrets
- [ ] `push_subscriptions` table has RLS policies
- [ ] Service Worker (`sw-push.js`) registered correctly
- [ ] Test push notification delivery end-to-end

### Password Reset

- [ ] Password reset email template configured
- [ ] `/reset-password` route accessible
- [ ] Redirect URL configured for production domain
- [ ] Reset flow tested end-to-end

### Collaboration

- [ ] `project_members` RLS policies verified (per-role access)
- [ ] `project_invites` expiry and use-count logic working
- [ ] `accept_project_invite` function tested
- [ ] Activity feed logging verified

---

## 5. Authentication

- [ ] Email confirmation configured
- [ ] Login/signup flow tested
- [ ] Password reset flow tested
- [ ] Session persistence works
- [ ] Logout clears session correctly
- [ ] Auth redirect URLs updated for production domain

---

## 6. Environment Variables

### Required Variables

| Variable | Set | Verified |
|----------|-----|----------|
| `VITE_SUPABASE_URL` | ☐ | ☐ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ☐ | ☐ |
| `VITE_SUPABASE_PROJECT_ID` | ☐ | ☐ |

### Security Check

- [ ] No secrets in client-side code
- [ ] Production keys are different from development

---

## 7. Performance

- [ ] Images optimized
- [ ] Lazy loading for routes
- [ ] Bundle size acceptable

### Bundle Size Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Initial JS | < 250KB | ___KB |
| Total JS | < 600KB | ___KB |
| CSS | < 60KB | ___KB |

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

## PWA Installation Test

### Desktop (Chrome)
1. Open production URL
2. Look for install icon in address bar
3. Click to install
4. Verify app opens in standalone window
5. Verify icon in taskbar/dock

### Mobile (iOS)
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Verify icon appears
5. Open from home screen
6. Verify standalone mode (no browser UI)

### Mobile (Android)
1. Open in Chrome
2. Tap menu (three dots)
3. Select "Install app" or "Add to Home Screen"
4. Verify icon appears
5. Open from home screen
6. Verify standalone mode

---

## Version History

| Version | Date | Deployed By | PWA Verified | Notes |
|---------|------|-------------|--------------|-------|
| 4.0.0-alpha.16 | Dec 2024 | | ☐ | RC with PWA |
| 4.0.0-rc.1 | Dec 2024 | | ☐ | Milestone release |

---

*Last updated: 2025-12-17*
