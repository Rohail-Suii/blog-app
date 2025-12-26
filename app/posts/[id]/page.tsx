/**
 * Post Detail Page
 * Displays a single blog post with comments
 * Uses Static Generation with ISR (revalidate every 60 seconds)
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createServerApolloClient } from '@/lib/apollo/client';
import { GET_POST_BY_ID, GET_ALL_POST_IDS } from '@/graphql';
import type { GetPostByIdResponse, GetPostByIdVariables, GetAllPostIdsResponse } from '@/graphql';
import { formatDate, extractExcerpt } from '@/lib/utils';
import { PostActionsWrapper } from './PostActionsWrapper';
import { CommentsSectionWrapper } from './CommentsSectionWrapper';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate static params for all posts
 * This enables Static Generation for all post pages
 */
export async function generateStaticParams() {
  const client = createServerApolloClient();

  try {
    const { data } = await client.query<GetAllPostIdsResponse>({
      query: GET_ALL_POST_IDS,
    });

    // Extract posts from edges/node structure
    const posts = data?.postsCollection?.edges?.map(edge => edge.node) || [];

    return posts.map((p) => ({ id: p.id }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const client = createServerApolloClient();

  try {
    const { data } = await client.query<GetPostByIdResponse, GetPostByIdVariables>({
      query: GET_POST_BY_ID,
      variables: { id },
    });

    // Extract post from edges/node structure
    const post = data?.postsCollection?.edges?.[0]?.node;

    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
      };
    }

    const excerpt = post.excerpt || extractExcerpt(post.body, 160);

    return {
      title: post.title,
      description: excerpt,
      openGraph: {
        title: post.title,
        description: excerpt,
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: ['Blog App User'],
        images: post.featured_image ? [post.featured_image] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: excerpt,
        images: post.featured_image ? [post.featured_image] : undefined,
      },
      alternates: {
        canonical: `/posts/${post.id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }
}

async function getPost(id: string) {
  const client = createServerApolloClient();

  try {
    const { data, error } = await client.query<GetPostByIdResponse, GetPostByIdVariables>({
      query: GET_POST_BY_ID,
      variables: { id },
    });

    if (error) {
      console.error('GraphQL Error:', error);
      return null;
    }

    // Extract post from edges/node structure
    return data?.postsCollection?.edges?.[0]?.node || null;
  } catch (err) {
    console.error('Failed to fetch post:', err);
    return null;
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  // Get current user for edit/delete permissions
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to posts
      </Link>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={post.featured_image}
            alt={post.title}
            className="h-64 w-full object-cover sm:h-80"
          />
        </div>
      )}

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-serif tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl leading-tight mb-6">
          {post.title}
        </h1>

        <div className="flex items-center justify-between border-b border-gray-100 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium font-serif">
              {post.author?.display_name ? post.author.display_name[0] : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {post.author?.display_name || 'Unknown Author'}
                </span>
                <button className="text-sm text-green-600 hover:text-green-700">Follow</button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-sm text-gray-500">4 min read</span>
                <span>·</span>
                <time dateTime={post.created_at}>
                  {formatDate(post.created_at)}
                </time>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-gray-600 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button className="hover:text-gray-600 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
            </button>
            {/* Edit/Delete Actions for author */}
            <PostActionsWrapper
              postId={post.id}
              postTitle={post.title}
              authorId={post.author_id}
              currentUserId={user?.id}
            />
          </div>
        </div>

        {/* Draft Badge */}
        {post.status === 'draft' && (
          <span className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Draft
          </span>
        )}
      </header>

      {/* Post Excerpt */}
      {post.excerpt && (
        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
          <p className="text-lg italic text-gray-600 dark:text-gray-400">
            {post.excerpt}
          </p>
        </div>
      )}

      {/* Post Body */}
      <div
        className="prose prose-lg prose-gray max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      {/* Comments Section */}
      <CommentsSectionWrapper postId={post.id} />

      {/* Post Footer */}
      <footer className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← View all posts
          </Link>

          <Link
            href="/posts/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Write your own post
          </Link>
        </div>
      </footer>
    </article>
  );
}
