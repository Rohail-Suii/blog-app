/**
 * Homepage
 * Stunning hero section with paginated blog posts
 * Uses Static Generation with ISR (revalidate every 60 seconds)
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerApolloClient } from '@/lib/apollo/client';
import { GET_POSTS_WITH_OFFSET } from '@/graphql';
import type { GetPostsWithOffsetResponse, GetPostsWithOffsetVariables, Post } from '@/graphql';
import { PostList } from '@/components/posts';
import { Pagination, PostListSkeleton, ErrorMessage } from '@/components/ui';

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Posts per page
const POSTS_PER_PAGE = 6;

export const metadata: Metadata = {
  title: 'Blog App - Share Your Stories',
  description: 'Discover amazing blog posts from our community. Read stories, tutorials, and insights from writers around the world.',
  openGraph: {
    title: 'Blog App - Share Your Stories',
    description: 'Discover amazing blog posts from our community. Read stories, tutorials, and insights from writers around the world.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog App - Share Your Stories',
    description: 'Discover amazing blog posts from our community.',
  },
  alternates: {
    canonical: '/',
  },
};

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getPosts(page: number) {
  const client = createServerApolloClient();
  const offset = (page - 1) * POSTS_PER_PAGE;

  try {
    const { data, error } = await client.query<GetPostsWithOffsetResponse, GetPostsWithOffsetVariables>({
      query: GET_POSTS_WITH_OFFSET,
      variables: {
        first: POSTS_PER_PAGE,
        offset,
        orderBy: [{ created_at: 'DescNullsLast' }],
      },
    });

    if (error) {
      console.error('GraphQL Error:', error);
      return { posts: [], totalCount: 0, error: error.message };
    }

    const posts = data?.postsCollection?.edges?.map(edge => edge.node) || [];
    const totalCount = data?.postsCount?.edges?.length || posts.length;
    const pageInfo = data?.postsCollection?.pageInfo;

    return { posts, totalCount, pageInfo, error: null };
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    return {
      posts: [],
      totalCount: 0,
      error: err instanceof Error ? err.message : 'Failed to fetch posts'
    };
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const { posts, totalCount, pageInfo, error } = await getPosts(currentPage);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  const hasNextPage = pageInfo?.hasNextPage ?? currentPage < totalPages;
  const hasPreviousPage = pageInfo?.hasPreviousPage ?? currentPage > 1;

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        {/* Animated background orbs */}
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-purple-500/20 blur-[100px] animate-float" />
        <div className="absolute right-1/4 bottom-20 h-72 w-72 rounded-full bg-pink-500/20 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[100px] animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 animate-fadeInUp">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            Discover amazing stories
          </div>

          {/* Main heading with gradient */}
          <h1 className="animate-fadeInUp mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: '0.1s' }}>
            <span className="block gradient-text">Share Your Stories</span>
            <span className="block text-foreground/80 mt-2">With the World</span>
          </h1>

          {/* Description */}
          <p className="animate-fadeInUp mx-auto max-w-2xl text-lg text-foreground/60 sm:text-xl" style={{ animationDelay: '0.2s' }}>
            A beautiful space to write, read, and connect. Discover insights, tutorials, and creative stories from our vibrant community.
          </p>

          {/* CTA buttons */}
          <div className="animate-fadeInUp mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/posts/new"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
            >
              <svg className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start Writing
              {/* Shine effect */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-xl glass px-8 py-4 font-semibold text-foreground transition-all duration-300 hover:scale-105 hover:border-purple-500/30"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Stories
            </Link>
          </div>

          {/* Stats */}
          {totalCount > 0 && (
            <div className="animate-fadeInUp mt-16 flex justify-center gap-8 sm:gap-16" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">{totalCount}+</p>
                <p className="text-sm text-foreground/50">Stories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">∞</p>
                <p className="text-sm text-foreground/50">Possibilities</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text">24/7</p>
                <p className="text-sm text-foreground/50">Inspiration</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Posts Section */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Latest Stories
            </h2>
            {totalCount > POSTS_PER_PAGE && (
              <span className="text-sm text-foreground/50">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>

          {/* Error State */}
          {error && (
            <ErrorMessage
              title="Failed to load posts"
              message={error}
            />
          )}

          {/* Posts List */}
          {!error && (
            <>
              <Suspense fallback={<PostListSkeleton count={POSTS_PER_PAGE} />}>
                <PostList posts={posts as Post[]} />
              </Suspense>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                  />
                </div>
              )}

              {/* Total count */}
              {totalCount > 0 && (
                <p className="mt-8 text-center text-sm text-foreground/40">
                  Showing {(currentPage - 1) * POSTS_PER_PAGE + 1} - {Math.min(currentPage * POSTS_PER_PAGE, totalCount)} of {totalCount} stories
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
