/**
 * Root Layout
 * Main application layout with providers and global styles
 */

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Site-wide metadata
export const metadata: Metadata = {
  title: {
    default: 'Blog App - Share Your Stories',
    template: '%s | Blog App',
  },
  description: 'A modern blog platform built with Next.js, Supabase, and GraphQL. Share your thoughts, ideas, and stories with the world.',
  keywords: ['blog', 'writing', 'articles', 'stories', 'nextjs', 'supabase'],
  authors: [{ name: 'Blog App' }],
  creator: 'Blog App',
  publisher: 'Blog App',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Blog App',
    title: 'Blog App - Share Your Stories',
    description: 'A modern blog platform built with Next.js, Supabase, and GraphQL.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog App - Share Your Stories',
    description: 'A modern blog platform built with Next.js, Supabase, and GraphQL.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-gray-50 font-sans antialiased dark:bg-gray-900`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
