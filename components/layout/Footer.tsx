/**
 * Footer Component
 * Premium footer with glass effect and gradient accents
 */

'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/80">
      {/* Decorative gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 font-bold text-white shadow-lg shadow-purple-500/25 transition-all group-hover:scale-110">
                B
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Blog</span>
                <span className="text-foreground">App</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              A premium blogging experience built for modern storytellers. Share your thoughts with the world in style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/posts/new" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                  Write a Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Community
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Stay Connected
            </h3>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Subscribe to get the latest stories and updates.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800"
              />
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} BlogApp. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons - Placeholders */}
            <div className="flex gap-4 text-gray-400">
              <span className="h-5 w-5 bg-current opacity-20 hover:opacity-100 transition-opacity cursor-pointer rounded-full" />
              <span className="h-5 w-5 bg-current opacity-20 hover:opacity-100 transition-opacity cursor-pointer rounded-full" />
              <span className="h-5 w-5 bg-current opacity-20 hover:opacity-100 transition-opacity cursor-pointer rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
