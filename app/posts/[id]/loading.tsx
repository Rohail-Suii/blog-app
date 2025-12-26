/**
 * Post Detail Loading State
 * Skeleton loader for the post detail page
 */

import { PostDetailSkeleton } from '@/components/ui';

export default function PostLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <PostDetailSkeleton />
    </div>
  );
}
