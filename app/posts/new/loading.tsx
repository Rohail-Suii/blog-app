/**
 * New Post Loading State
 */

import { Skeleton } from '@/components/ui';

export default function NewPostLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <header className="mb-8">
        <Skeleton className="mb-2 h-9 w-64" />
        <Skeleton className="h-5 w-96" />
      </header>

      {/* Form Skeleton */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <div className="space-y-6">
          {/* Title Field */}
          <div>
            <Skeleton className="mb-1 h-5 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Body Field */}
          <div>
            <Skeleton className="mb-1 h-5 w-20" />
            <Skeleton className="h-64 w-full" />
          </div>

          {/* Author Info */}
          <Skeleton className="h-16 w-full" />

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
