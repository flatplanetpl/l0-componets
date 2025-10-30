import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EduPlatform - Learn Without Limits',
  description: 'Online learning platform with expert courses and resources',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-muted/50">
          {children}
        </div>
      </body>
    </html>
  );
}