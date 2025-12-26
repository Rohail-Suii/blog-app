/**
 * Post Card Component
 * Stunning floating glass card with hover animations
 */

import Link from 'next/link';
import { formatDate, extractExcerpt } from '@/lib/utils';
import type { Post } from '@/graphql';

interface PostCardProps {
  post: Post;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const excerpt = post.excerpt || extractExcerpt(post.body, 180);

  return (
    <article
      className="group relative animate-fadeInUp opacity-0"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 opacity-0 blur-lg transition-all duration-500 group-hover:opacity-30" />

      <Link
        href={`/posts/${post.id}`}
        className="relative block overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl"
      >
        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative mb-4 overflow-hidden rounded-xl">
            <img
              src={post.featured_image}
              alt={post.title}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        )}

        {/* Status Badge */}
        {post.status === 'draft' && (
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Draft
          </span>
        )}

        {/* Title with gradient on hover */}
        <h2 className="mb-3 text-xl font-bold tracking-tight transition-all duration-300 group-hover:gradient-text">
          <span className="bg-gradient-to-r from-foreground to-foreground bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-orange-400">
            {post.title}
          </span>
        </h2>

        {/* Excerpt */}
        <p className="mb-5 text-sm leading-relaxed text-foreground/60">
          {excerpt}
        </p>

        {/* Footer with meta and animated arrow */}
        <div className="flex items-center justify-between">
          {/* Date with icon */}
          <div className="flex items-center gap-2 text-xs text-foreground/40">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>
          </div>

          {/* Read more with animated arrow */}
          <span className="flex items-center gap-2 text-sm font-medium text-purple-500 dark:text-purple-400">
            Read
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 transition-all duration-300 group-hover:bg-purple-500 group-hover:text-white">
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </span>
        </div>

        {/* Decorative corner gradient */}
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>
    </article>
  );
}
