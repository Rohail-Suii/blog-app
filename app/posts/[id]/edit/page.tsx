/**
 * Edit Post Page
 * Protected route for editing existing posts
 * Only accessible by the post author
 */

import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createServerApolloClient } from '@/lib/apollo/client';
import { GET_POST_BY_ID } from '@/graphql';
import type { GetPostByIdResponse, GetPostByIdVariables } from '@/graphql';
import { PostEditForm } from '@/components/posts/PostEditForm';

export const metadata: Metadata = {
    title: 'Edit Post - Blog App',
    description: 'Edit your blog post',
};

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

async function getPost(id: string) {
    const client = createServerApolloClient();

    try {
        const { data } = await client.query<GetPostByIdResponse, GetPostByIdVariables>({
            query: GET_POST_BY_ID,
            variables: { id },
        });

        return data?.postsCollection?.edges?.[0]?.node || null;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;

    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/auth/login?redirect=/posts/${id}/edit`);
    }

    // Fetch the post
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    // Check if current user is the author
    if (post.author_id !== user.id) {
        redirect(`/posts/${id}`);
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
                href={`/posts/${id}`}
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
                Back to post
            </Link>

            {/* Page Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Edit Post
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Make changes to your post below.
                </p>
            </header>

            {/* Edit Form */}
            <PostEditForm post={post} />
        </div>
    );
}
