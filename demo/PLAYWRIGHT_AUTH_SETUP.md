# Quick Start: Playwright Authentication Setup

This guide will help you enable authenticated E2E tests in your EduPlatform demo app.

## Current State

✅ Basic tests (no auth required) are working
⏸️ Admin dashboard tests are skipped (require authentication)

## Quick Setup (5 minutes)

### 1. Update NextAuth to Support Test Credentials

**File:** `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { authOptionsTest } from '@/lib/auth.test';

// Use test credentials in Playwright tests
const options = process.env.PLAYWRIGHT_TEST === 'true'
  ? authOptionsTest
  : authOptions;

const handler = NextAuth(options);

export { handler as GET, handler as POST };
```

### 2. Create a Simple Signin Page

**File:** `app/signin/page.tsx`

```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center">Sign In</h2>
          <p className="mt-2 text-center text-gray-600">
            EduPlatform Admin
          </p>
        </div>

        {/* Test Credentials Form (dev/test only) */}
        {process.env.NODE_ENV !== 'production' && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin@test.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="test123"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with Test Credentials
            </button>

            <p className="text-xs text-center text-gray-500">
              Test mode only - use admin@test.com / test123
            </p>
          </form>
        )}

        {/* Google OAuth */}
        <div className="mt-6">
          <button
            onClick={() => signIn('google', { callbackUrl: '/admin/dashboard' })}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 3. Update Package.json Scripts

**File:** `package.json`

Add a script for running tests with authentication:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:auth": "PLAYWRIGHT_TEST=true playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

### 4. Run Tests

```bash
# Run all tests (including authenticated ones)
npm run test:e2e:auth

# Run with UI mode
PLAYWRIGHT_TEST=true npm run test:e2e:ui

# Update snapshots if needed
PLAYWRIGHT_TEST=true npx playwright test --update-snapshots
```

## Test Accounts

The test credentials provider accepts any of these:

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | test123 | admin |
| operator@test.com | test123 | operator |
| user@test.com | test123 | user |

## Re-enable Skipped Tests

Once authentication is working, you can re-enable the skipped tests:

**File:** `tests/e2e/admin-dashboard.spec.ts`

1. Change `test.skip(` to `test(` for authenticated tests
2. Rename the file to `admin-dashboard.auth.spec.ts`
3. The tests will now run with authentication

Example:
```typescript
// From:
test.skip('should load dashboard page', async ({ page }) => {

// To:
test('should load dashboard page', async ({ page }) => {
```

## Troubleshooting

### "Missing Google OAuth credentials" Error

Set `PLAYWRIGHT_TEST=true` when running tests, or the app will try to use Google OAuth.

### Authentication Not Working

1. Check `.auth/user.json` exists after running tests
2. Verify signin page is at `/signin`
3. Try running with `--headed` to see what's happening:
   ```bash
   PLAYWRIGHT_TEST=true npx playwright test --headed --project=setup
   ```

### NEXTAUTH_SECRET Missing

Add to `.env.local`:
```bash
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

## What Was Created

- ✅ `lib/auth.test.ts` - Test credentials provider
- ✅ `tests/auth.setup.ts` - Authentication setup for tests
- ✅ `tests/README.md` - Detailed documentation
- ✅ `playwright.config.ts` - Updated with auth projects
- ✅ `.gitignore` - Added `.auth/` directory

## Next Steps

1. Implement the signin page
2. Update the NextAuth route
3. Run `npm run test:e2e:auth`
4. Re-enable skipped tests
5. Add more authenticated test scenarios

## Full Documentation

See `tests/README.md` for complete documentation including CI/CD setup and advanced scenarios.
