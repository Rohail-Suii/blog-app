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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 px-4 py-12 dark:bg-gray-900">
      {/* Background Orbs */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl filter animate-float opacity-50 transition-opacity duration-1000" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl filter animate-float opacity-50 transition-opacity duration-1000" style={{ animationDelay: '2s' }} />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl filter animate-float opacity-50 transition-opacity duration-1000" style={{ animationDelay: '4s' }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="group inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-lg shadow-purple-500/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/40">
              <span className="text-2xl font-bold text-white">B</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Blog<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">App</span>
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Share your story
              </span>
            </div>
          </Link>
        </div>

        {/* Content Card */}
        <div className="glass rounded-2xl p-1 shadow-2xl">
          <div className="rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-900/50 sm:p-8">
            {children}
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-center gap-4">
            <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
