/**
 * Post List Component
 * Clean, single-column feed
 */

import { PostCard } from './PostCard';
import type { Post } from '@/graphql';
import Link from 'next/link';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          No stories yet
        </h3>
        <p className="text-gray-500 mb-6">
          Be the first to share your thoughts with the world.
        </p>
        <Link
          href="/posts/new"
          className="inline-block rounded-full bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Write a story
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
