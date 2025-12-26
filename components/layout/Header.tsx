/**
 * Header Component
 * Premium glass-morphic navigation with gradient logo
 */

import Link from 'next/link';
import { UserMenu } from '@/components/auth';

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo with gradient */}
        <Link href="/" className="group flex items-center gap-3">
          {/* Animated logo icon */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 shadow-lg shadow-purple-500/25 transition-all duration-300 group-hover:shadow-purple-500/40 group-hover:scale-105">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-50" />
          </div>
          <span className="text-2xl font-bold">
            <span className="gradient-text">Blog</span>
            <span className="text-foreground">App</span>
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="relative px-4 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:text-foreground group"
          >
            <span className="relative z-10">Home</span>
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </Link>
          <Link
            href="/search"
            className="relative px-4 py-2 text-sm font-medium text-foreground/70 transition-all duration-200 hover:text-foreground group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore
            </span>
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </Link>
          <Link
            href="/posts/new"
            className="relative ml-2 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Write
            </span>
            {/* Shine effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </Link>
        </nav>

        {/* Right side - User Menu */}
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
