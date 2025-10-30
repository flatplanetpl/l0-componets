import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { authOptionsTest } from '@/lib/auth.test';

// Use test credentials in Playwright tests
const options = process.env.PLAYWRIGHT_TEST === 'true'
  ? authOptionsTest
  : authOptions;

const handler = NextAuth(options);

export { handler as GET, handler as POST };