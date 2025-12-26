/**
 * Post Edit Form Component
 * Form for editing existing blog posts with validation
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { UPDATE_POST } from '@/graphql';
import type { UpdatePostResponse, UpdatePostVariables, Post } from '@/graphql';

// Validation schema
const postSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(500, 'Title must be less than 500 characters'),
    body: z
        .string()
        .min(1, 'Body is required')
        .min(10, 'Body must be at least 10 characters'),
    excerpt: z
        .string()
        .max(300, 'Excerpt must be less than 300 characters')
        .optional()
        .or(z.literal('')),
    featured_image: z
        .string()
        .url('Must be a valid URL')
        .optional()
        .or(z.literal('')),
    status: z.enum(['draft', 'published']),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostEditFormProps {
    post: Post;
}

export function PostEditForm({ post }: PostEditFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: post.title,
            body: post.body,
            excerpt: post.excerpt || '',
            featured_image: post.featured_image || '',
            status: post.status,
        },
    });

    const status = watch('status');

    const [updatePost, { loading }] = useMutation<UpdatePostResponse, UpdatePostVariables>(
        UPDATE_POST,
        {
            update(cache, result) {
                const data = result.data;
                const updated = data?.updatepostsCollection?.records?.[0];
                if (updated) {
                    // Evict posts collection to force refetch
                    cache.evict({ fieldName: 'postsCollection' });
                    cache.gc();
                }
            },
            onCompleted(data) {
                const updatedPost = data?.updatepostsCollection?.records?.[0];
                if (updatedPost) {
                    router.push(`/posts/${updatedPost.id}`);
                    router.refresh();
                }
            },
            onError(err) {
                setError(err.message || 'Failed to update post. Please try again.');
            },
        }
    );

    const onSubmit = async (data: PostFormData) => {
        setError(null);

        await updatePost({
            variables: {
                id: post.id,
                title: data.title,
                body: data.body,
                excerpt: data.excerpt || undefined,
                featured_image: data.featured_image || undefined,
                status: data.status,
            },
        });
    };

    // Warn about unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
                    <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Status Toggle */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Post Status
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {status === 'draft' ? 'Only visible to you' : 'Visible to everyone'}
                    </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        {...register('status')}
                        checked={status === 'published'}
                        onChange={(e) => {
                            const event = {
                                target: {
                                    name: 'status',
                                    value: e.target.checked ? 'published' : 'draft',
                                },
                            };
                            register('status').onChange(event);
                        }}
                        className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:ring-2 peer-focus:ring-blue-500 dark:bg-gray-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {status === 'published' ? 'Published' : 'Draft'}
                    </span>
                </label>
            </div>

            {/* Title Field */}
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Title
                </label>
                <input
                    {...register('title')}
                    type="text"
                    id="title"
                    placeholder="Enter your post title..."
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.title.message}
                    </p>
                )}
            </div>

            {/* Excerpt Field */}
            <div>
                <label
                    htmlFor="excerpt"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Excerpt <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                    {...register('excerpt')}
                    id="excerpt"
                    rows={2}
                    placeholder="A short summary of your post..."
                    className="mt-1 block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {errors.excerpt && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.excerpt.message}
                    </p>
                )}
            </div>

            {/* Featured Image Field */}
            <div>
                <label
                    htmlFor="featured_image"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Featured Image URL <span className="text-gray-400">(optional)</span>
                </label>
                <input
                    {...register('featured_image')}
                    type="url"
                    id="featured_image"
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {errors.featured_image && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.featured_image.message}
                    </p>
                )}
            </div>

            {/* Body Field */}
            <div>
                <label
                    htmlFor="body"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Content
                </label>
                <textarea
                    {...register('body')}
                    id="body"
                    rows={12}
                    placeholder="Write your post content here..."
                    className="mt-1 block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {errors.body && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.body.message}
                    </p>
                )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || loading || !isDirty}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting || loading ? (
                        <>
                            <svg
                                className="h-4 w-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </form>
    );
}
