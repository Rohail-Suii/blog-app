/**
 * Footer Component
 * Minimal, simple footer
 */

'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#e6e6e6] bg-white dark:bg-[#121212] dark:border-[#2f2f2f] py-12 mt-12 transition-colors">
      <div className="mx-auto max-w-[1200px] px-6 flex flex-col items-center">
        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Help</Link>
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-600">
          © {currentYear} MediumClone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
