/**
 * Post Card Component
 * Medium-style editorial list item
 */

import Link from 'next/link';
import { formatDate, extractExcerpt } from '@/lib/utils';
import type { Post } from '@/graphql';

interface PostCardProps {
  post: Post;
  index?: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const excerpt = post.excerpt || extractExcerpt(post.body, 140);

  return (
    <article className="border-b border-[#f2f2f2] last:border-0 py-8 group">
      <Link href={`/posts/${post.id}`} className="flex justify-between gap-12">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-medium">A</span>
              <span className="text-sm text-gray-700 font-medium">{post.author?.display_name || 'Author'}</span>
              <span className="text-xs text-gray-400">•</span>
              <time dateTime={post.created_at} className="text-sm text-gray-500">
                {formatDate(post.created_at)}
              </time>
            </div>

            <h2 className="text-xl md:text-2xl font-bold font-serif text-gray-900 mb-2 group-hover:underline decoration-gray-900 decoration-2 underline-offset-4 leading-tight">
              {post.title}
            </h2>

            <p className="hidden md:block text-base text-gray-500 font-sans leading-relaxed line-clamp-2 mb-4">
              {excerpt}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2">
            {post.status === 'draft' && (
              <span className="inline-flex items-center rounded-sm bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                Draft
              </span>
            )}
            <span className="text-sm text-gray-500">3 min read</span>
            <span className="text-sm text-gray-400">Selected for you</span>
          </div>
        </div>

        {post.featured_image && (
          <div className="flex-shrink-0 w-24 h-24 md:w-40 md:h-28 hidden sm:block">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
        )}
      </Link>
    </article>
  );
}
