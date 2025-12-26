/**
 * Homepage Loading State
 * Skeleton loader for the main page
 */

import { PostListSkeleton } from '@/components/ui';

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <div className="mx-auto mb-4 h-12 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="mx-auto h-6 w-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </header>

      {/* Posts List Skeleton */}
      <PostListSkeleton count={5} />
    </div>
  );
}
