import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth-provider';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import './globals.css';

export const metadata: Metadata = {
  title: 'CarePoint',
  description: 'Book a doctor appointment in minutes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper text-ink font-sans antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
