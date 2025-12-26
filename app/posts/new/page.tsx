/**
 * Create New Post Page
 * Page for creating new blog posts (auth required)
 * Uses Server-Side Rendering with auth check
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { PostForm } from '@/components/posts';

// Force dynamic rendering (SSR) for this page
// Auth check must happen on every request
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Create New Post',
  description: 'Write and publish a new blog post. Share your thoughts, ideas, and stories with our community.',
  robots: {
    index: false, // Don't index this page (requires auth)
    follow: true,
  },
};

export default async function NewPostPage() {
  // Server-side auth check
  const user = await getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login?redirectTo=/posts/new');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create New Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your thoughts, ideas, and stories with our community
        </p>
      </header>

      {/* Post Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <PostForm />
      </div>

      {/* Writing Tips */}
      <aside className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
        <h2 className="mb-3 text-sm font-semibold text-blue-800 dark:text-blue-200">
          Writing Tips
        </h2>
        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Use a clear, descriptive title that captures attention</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Break your content into paragraphs for better readability</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Start with a hook to engage your readers</span>
          </li>
          <li className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Proofread before publishing</span>
          </li>
        </ul>
      </aside>
    </div>
  );
}
