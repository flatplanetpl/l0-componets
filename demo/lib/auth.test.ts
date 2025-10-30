import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Auth options for testing - includes a test credentials provider
export const authOptionsTest: NextAuthOptions = {
  providers: [
    // Keep Google provider if credentials are available
    ...(googleClientId && googleClientSecret ? [
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
    // Add credentials provider for testing
    CredentialsProvider({
      name: 'Test Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Only allow in development/test environment
        if (process.env.NODE_ENV === 'production') {
          return null;
        }

        // Simple test credentials
        if (credentials?.email && credentials?.password === 'test123') {
          return {
            id: '1',
            name: 'Test User',
            email: credentials.email,
            image: null
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role information to the session
      if (session.user?.email === process.env.ADMIN_EMAIL || session.user?.email === 'admin@test.com') {
        (session.user as any).role = 'admin';
      } else if (session.user?.email === 'operator@test.com') {
        (session.user as any).role = 'operator';
      } else if (session.user?.email) {
        (session.user as any).role = 'user';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'test-secret-for-e2e-tests',
  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
  debug: process.env.NODE_ENV === 'development',
};
