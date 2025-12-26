/**
 * Auth Layout
 * Layout for authentication pages (login, signup)
 */

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Blog App',
  description: 'Sign in or create an account to start blogging',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center bg-black text-white font-serif font-bold text-2xl rounded-sm">
              M
            </div>
          </Link>
          <h2 className="mt-6 text-2xl font-serif font-bold text-gray-900">
            Welcome back.
          </h2>
        </div>

        {children}

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <div className="flex justify-center gap-4">
            <Link href="#" className="hover:text-black transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-black transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
