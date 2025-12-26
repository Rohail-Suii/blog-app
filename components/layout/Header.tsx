/**
 * Header Component
 * Minimal, editorial-style header
 */

import Link from 'next/link';
import { UserMenu } from '@/components/auth';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e6e6e6] dark:bg-[#121212] dark:border-[#2f2f2f]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center bg-black dark:bg-white text-white dark:text-black font-serif font-bold text-xl rounded-sm">
            M
          </div>
          <span className="text-xl font-bold font-serif tracking-tight text-gray-900 dark:text-gray-50">
            Medium<span className="opacity-50 font-sans font-normal text-base ml-1">Clone</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/search"
              className="text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Search
            </Link>
            <Link
              href="/posts/new"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Write
            </Link>
          </nav>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden md:block" />

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
