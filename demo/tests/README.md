# Playwright E2E Tests

This directory contains end-to-end tests for the EduPlatform demo application.

## Test Structure

- `e2e/` - Regular E2E tests (no authentication required)
- `e2e/*.auth.spec.ts` - Tests that require authentication
- `auth.setup.ts` - Authentication setup for authenticated tests

## Authentication Setup

The app uses NextAuth.js with Google OAuth. To enable authenticated tests, you need to add a test credentials provider.

### Step 1: Update NextAuth Configuration

You have two options:

#### Option A: Use Environment Variable (Recommended)

Update `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { authOptionsTest } from '@/lib/auth.test';

// Use test auth options in test/development environment
const options = process.env.PLAYWRIGHT_TEST === 'true' ? authOptionsTest : authOptions;

const handler = NextAuth(options);

export { handler as GET, handler as POST };
```

Then set the environment variable when running tests:

```bash
PLAYWRIGHT_TEST=true npm run test:e2e
```

#### Option B: Separate Test Auth Route

Create `app/api/auth-test/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import { authOptionsTest } from '@/lib/auth.test';

const handler = NextAuth(authOptionsTest);

export { handler as GET, handler as POST };
```

Update `tests/auth.setup.ts` to use `/auth-test` instead of `/auth` for the signin URL.

### Step 2: Create Signin Page with Credentials Support

Create or update `app/signin/page.tsx`:

```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
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

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/admin/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold">Sign In</h2>

        {/* Credentials form (only in dev/test) */}
        {process.env.NODE_ENV !== 'production' && (
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Sign in with Credentials
            </button>
          </form>
        )}

        {/* Google OAuth */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white border py-2 rounded hover:bg-gray-50"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
```

### Step 3: Update .gitignore

Add to `.gitignore`:

```
# Playwright
.auth/
test-results/
playwright-report/
```

### Step 4: Install Dependencies

If not already installed:

```bash
npm install next-auth-credentials-provider
```

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Update Snapshots
```bash
npx playwright test --update-snapshots
```

### Run Specific Test File
```bash
npx playwright test admin-dashboard
```

### Run with UI
```bash
npm run test:e2e:ui
```

### Run Only Authenticated Tests
```bash
npx playwright test --project=chromium-authenticated
```

### Run Only Non-Authenticated Tests
```bash
npx playwright test --project=chromium
```

## Test Users

The test credentials provider (in `lib/auth.test.ts`) accepts:

- **Admin**: `admin@test.com` / `test123` (role: admin)
- **Operator**: `operator@test.com` / `test123` (role: operator)
- **User**: Any other email / `test123` (role: user)

## Creating Authenticated Tests

To create a test that requires authentication, name it `*.auth.spec.ts`:

```typescript
// tests/e2e/admin-dashboard.auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard (Authenticated)', () => {
  test('should display admin dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // User is already authenticated via auth.setup.ts
    await expect(page).toHaveTitle(/EduPlatform/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
```

## Troubleshooting

### Tests fail with "Not authenticated"

1. Verify `tests/auth.setup.ts` ran successfully
2. Check that `.auth/user.json` was created
3. Ensure NextAuth is using the test credentials provider
4. Check browser console for auth errors: `npx playwright test --headed`

### NEXTAUTH_SECRET error

Add to `.env.local`:
```
NEXTAUTH_SECRET=your-secret-key-for-development
```

Generate a secret:
```bash
openssl rand -base64 32
```

### Signin page not found

Ensure you've created `app/signin/page.tsx` with credentials support.

## CI/CD

For GitHub Actions, add secrets and use:

```yaml
- name: Run Playwright tests
  run: PLAYWRIGHT_TEST=true npm run test:e2e
  env:
    NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```
