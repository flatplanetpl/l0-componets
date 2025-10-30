import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

console.log('=== AUTH DEBUG ===');
console.log('GOOGLE_CLIENT_ID:', googleClientId);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!googleClientId || !googleClientSecret) {
  throw new Error('Missing Google OAuth credentials. Check your .env.local file.');
}

export const authOptions: NextAuthOptions = {
  providers: [
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
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role information to the session
      // In a real app, you would fetch this from your database
      // For now, we'll set role based on email (first user gets admin)
      if (session.user?.email === process.env.ADMIN_EMAIL) {
        (session.user as any).role = 'admin';
      } else if (session.user?.email) {
        // You can add more logic here to determine operator vs user
        // For now, we'll default to 'user' role
        (session.user as any).role = 'user';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
  debug: process.env.NODE_ENV === 'development',
};