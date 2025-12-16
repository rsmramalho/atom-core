# MindMate Fork Guide

## Setting Up Your Development Environment from v4.0.0-rc.1

This guide helps the team fork and set up the MindMate project for independent app development.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Fork & Clone](#fork--clone)
3. [Supabase Setup](#supabase-setup)
4. [Environment Configuration](#environment-configuration)
5. [Install Dependencies](#install-dependencies)
6. [Database Migration](#database-migration)
7. [Run Development Server](#run-development-server)
8. [Verify Setup](#verify-setup)
9. [Project Structure Overview](#project-structure-overview)
10. [Key Files Reference](#key-files-reference)
11. [Common Issues](#common-issues)

---

## Prerequisites

Ensure you have the following installed:

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 18+ | `node --version` |
| npm or bun | Latest | `npm --version` or `bun --version` |
| Git | Latest | `git --version` |

You'll also need:
- A [Supabase](https://supabase.com) account (free tier works)
- A code editor (VS Code recommended)

---

## Fork & Clone

### 1. Fork the Repository

Click "Fork" on the GitHub repository page to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/mindmate-atom-engine.git
cd mindmate-atom-engine
```

### 3. Checkout the Milestone Tag

```bash
git checkout v4.0.0-rc.1
```

Or create a new branch from the milestone:

```bash
git checkout -b app-development v4.0.0-rc.1
```

---

## Supabase Setup

### 1. Create a New Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `mindmate-app` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Your API Keys

Once the project is ready:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (for admin operations, keep secret!)

---

## Environment Configuration

### 1. Create Environment File

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Or create manually:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

### 2. Configure Supabase Client

The client is pre-configured at `src/integrations/supabase/client.ts`. It reads from environment variables automatically.

> ⚠️ **Never commit `.env` to version control!**

---

## Install Dependencies

```bash
# Using npm
npm install

# Or using bun (faster)
bun install
```

---

## Database Migration

### 1. Apply Migrations

Navigate to your Supabase dashboard → **SQL Editor** and run the migrations in order from `supabase/migrations/`:

1. Open each `.sql` file in chronological order
2. Copy contents to SQL Editor
3. Click "Run"

### 2. Verify Tables Created

Go to **Table Editor** and confirm these tables exist:

| Table | Purpose |
|-------|---------|
| `items` | All item types (tasks, projects, habits, notes, reflections) |
| `onboarding_progress` | User onboarding state |
| `onboarding_analytics` | Onboarding event tracking |

### 3. Enable Row Level Security

RLS should be enabled automatically. Verify in **Authentication** → **Policies**.

---

## Run Development Server

```bash
# Using npm
npm run dev

# Or using bun
bun dev
```

The app will be available at `http://localhost:8080`

---

## Verify Setup

### Checklist

- [ ] App loads without errors
- [ ] Can create a new account
- [ ] Can log in
- [ ] Can create items in Inbox
- [ ] Debug Console opens with `Ctrl+Shift+E`
- [ ] All routes are accessible

### Test Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard |
| `/inbox` | Inbox capture |
| `/projects` | Projects list |
| `/calendar` | Calendar view |
| `/journal` | Journal/Reflections |
| `/ritual` | Ritual view |

---

## Project Structure Overview

```
mindmate/
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md      # System architecture
│   ├── API.md               # API reference
│   ├── CHANGELOG.md         # Version history
│   └── FULL_DOCUMENTATION.md # Complete reference
│
├── src/
│   ├── components/          # React components
│   │   ├── calendar/        # Calendar engine UI
│   │   ├── dashboard/       # Dashboard components
│   │   ├── inbox/           # Inbox capture
│   │   ├── journal/         # Journal/reflection
│   │   ├── layout/          # App layout, navigation
│   │   ├── onboarding/      # Onboarding flow
│   │   ├── project-sheet/   # Project detail view
│   │   ├── projects/        # Projects list
│   │   ├── shared/          # Reusable components
│   │   └── ui/              # shadcn/ui components
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAtomItems.ts  # Core CRUD operations
│   │   ├── useCalendarItems.ts
│   │   ├── useDashboardData.ts
│   │   ├── useMilestones.ts
│   │   └── useRitual.ts
│   │
│   ├── lib/                 # Utilities & engines
│   │   ├── parsing-engine.ts    # Input parsing
│   │   ├── dashboard-filters.ts # Filter logic
│   │   └── reflection-prompts.ts
│   │
│   ├── pages/               # Route pages
│   ├── types/               # TypeScript types
│   └── integrations/        # External integrations
│
├── supabase/
│   ├── config.toml          # Supabase config
│   └── migrations/          # Database migrations
│
└── public/                  # Static assets
```

---

## Key Files Reference

### Core Engine Files

| File | Purpose |
|------|---------|
| `src/lib/parsing-engine.ts` | Input parsing (@tokens, #tags) |
| `src/lib/dashboard-filters.ts` | Dashboard filter logic |
| `src/types/atom-engine.ts` | Core TypeScript types |
| `src/hooks/useAtomItems.ts` | CRUD operations |

### Configuration

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Design system tokens |
| `src/index.css` | CSS variables, themes |
| `vite.config.ts` | Build configuration |

### Entry Points

| File | Purpose |
|------|---------|
| `src/App.tsx` | App routes & providers |
| `src/main.tsx` | React entry point |
| `index.html` | HTML template |

---

## Common Issues

### "Invalid API key" Error

- Verify `.env` values match your Supabase project
- Restart dev server after changing `.env`

### "Permission denied" on Database

- Check RLS policies are applied
- Ensure user is authenticated for protected operations

### Types Out of Sync

If TypeScript types don't match database:

```bash
# Regenerate types (requires Supabase CLI)
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

### Port Already in Use

```bash
# Kill process on port 8080
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## Running Tests

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Run specific test file
npm run test -- src/lib/parsing-engine.test.ts
```

---

## Next Steps

1. **Review Documentation**: Start with `docs/ARCHITECTURE.md`
2. **Understand Data Model**: Study `src/types/atom-engine.ts`
3. **Explore Engines**: Read engine specs in `docs/FULL_DOCUMENTATION.md`
4. **Run Tests**: Ensure all 100+ tests pass
5. **Start Building**: Create your first feature branch!

---

## Support

- **Main Repository Issues**: For bugs in core engine
- **Team Communication**: Use your team's preferred channel
- **Documentation**: All specs in `/docs` folder

---

*Happy coding! 🚀*

*Fork Point: v4.0.0-rc.1 | December 2024*
