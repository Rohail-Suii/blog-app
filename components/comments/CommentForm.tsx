/**
 * Comment Form Component
 * Form for adding comments to posts
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { CREATE_COMMENT } from '@/graphql';
import type { CreateCommentResponse, CreateCommentVariables } from '@/graphql';
import { useAuth } from '@/lib/auth';

const commentSchema = z.object({
    body: z
        .string()
        .min(1, 'Comment is required')
        .max(2000, 'Comment must be less than 2000 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
    postId: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    placeholder?: string;
}

export function CommentForm({
    postId,
    parentId,
    onSuccess,
    onCancel,
    placeholder = 'Write a comment...'
}: CommentFormProps) {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
        defaultValues: { body: '' },
    });

    const [createComment, { loading }] = useMutation<CreateCommentResponse, CreateCommentVariables>(
        CREATE_COMMENT,
        {
            update(cache) {
                cache.evict({ fieldName: 'commentsCollection' });
                cache.gc();
            },
            onCompleted() {
                reset();
                onSuccess?.();
            },
            onError(err) {
                setError(err.message || 'Failed to post comment');
            },
        }
    );

    const onSubmit = async (data: CommentFormData) => {
        if (!user) {
            setError('You must be logged in to comment');
            return;
        }

        setError(null);

        await createComment({
            variables: {
                post_id: postId,
                author_id: user.id,
                body: data.body,
                parent_id: parentId,
            },
        });
    };

    if (!user) {
        return (
            <div className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        Sign in
                    </a>
                    {' '}to leave a comment
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/50">
                    <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
            )}

            <div>
                <textarea
                    {...register('body')}
                    rows={3}
                    placeholder={placeholder}
                    className="block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {errors.body && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.body.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting || loading ? (
                        <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Posting...
                        </>
                    ) : (
                        'Post Comment'
                    )}
                </button>
            </div>
        </form>
    );
}
