/**
 * Search Results Page
 * Displays posts matching the search query
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerApolloClient } from '@/lib/apollo/client';
import { SEARCH_POSTS } from '@/graphql';
import type { SearchPostsResponse, SearchPostsVariables, Post } from '@/graphql';
import { PostList } from '@/components/posts';
import { SearchBar } from '@/components/ui/SearchBar';
import { PostListSkeleton, ErrorMessage } from '@/components/ui';

export const metadata: Metadata = {
    title: 'Search - Blog App',
    description: 'Search for blog posts',
};

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

async function searchPosts(query: string) {
    if (!query.trim()) {
        return { posts: [], error: null };
    }

    const client = createServerApolloClient();

    try {
        const { data, error } = await client.query<SearchPostsResponse, SearchPostsVariables>({
            query: SEARCH_POSTS,
            variables: {
                searchQuery: `%${query}%`,
                first: 20,
                offset: 0,
            },
        });

        if (error) {
            console.error('Search Error:', error);
            return { posts: [], error: error.message };
        }

        const posts = data?.postsCollection?.edges?.map(edge => edge.node) || [];
        return { posts, error: null };
    } catch (err) {
        console.error('Failed to search posts:', err);
        return {
            posts: [],
            error: err instanceof Error ? err.message : 'Search failed'
        };
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const query = params.q || '';
    const { posts, error } = await searchPosts(query);

    return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Page Header */}
            <header className="mb-8">
                <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Search Posts
                </h1>
                <Suspense fallback={<div className="h-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />}>
                    <SearchBar className="max-w-xl" />
                </Suspense>
            </header>

            {/* Search Results */}
            {query && (
                <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {error ? (
                            'Search failed'
                        ) : posts.length === 0 ? (
                            <>No results found for "<span className="font-medium">{query}</span>"</>
                        ) : (
                            <>Found {posts.length} result{posts.length !== 1 ? 's' : ''} for "<span className="font-medium">{query}</span>"</>
                        )}
                    </p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <ErrorMessage
                    title="Search failed"
                    message={error}
                />
            )}

            {/* Results */}
            {!error && query && (
                <Suspense fallback={<PostListSkeleton count={5} />}>
                    <PostList posts={posts as Post[]} />
                </Suspense>
            )}

            {/* Empty State - No Query */}
            {!query && (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        Start searching
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Type in the search box above to find posts
                    </p>
                </div>
            )}

            {/* Back to Home */}
            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    ← Back to all posts
                </Link>
            </div>
        </div>
    );
}
