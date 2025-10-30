import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider } from '@frontend/components/ui/themeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EduPlatform - Learn Without Limits',
  description: 'Online learning platform with expert courses and resources',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
