/**
 * Post List Component
 * Beautiful masonry-style grid of post cards
 */

import { PostCard } from './PostCard';
import type { Post } from '@/graphql';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl glass p-12 text-center">
        {/* Decorative gradient orbs */}
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="relative">
          {/* Animated icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 animate-float">
            <svg
              className="h-10 w-10 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h3 className="mb-3 text-2xl font-bold gradient-text">
            No stories yet
          </h3>
          <p className="mx-auto max-w-sm text-foreground/60">
            Be the first to share your thoughts. Every great story starts with a single word.
          </p>

          <a
            href="/posts/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Write your first story
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
