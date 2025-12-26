/**
 * Post Actions Component
 * Edit and Delete buttons for post authors
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { DELETE_POST } from '@/graphql';
import type { DeletePostResponse, DeletePostVariables } from '@/graphql';
import { DeleteConfirmModal } from '@/components/ui';

interface PostActionsProps {
    postId: string;
    postTitle: string;
    authorId: string;
    currentUserId?: string;
}

export function PostActions({ postId, postTitle, authorId, currentUserId }: PostActionsProps) {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [deletePost, { loading: deleting }] = useMutation<DeletePostResponse, DeletePostVariables>(
        DELETE_POST,
        {
            variables: { id: postId },
            update(cache) {
                // Evict the post from cache
                cache.evict({ id: `posts:${postId}` });
                cache.evict({ fieldName: 'postsCollection' });
                cache.gc();
            },
            onCompleted() {
                router.push('/');
                router.refresh();
            },
            onError(err) {
                setError(err.message);
                setShowDeleteModal(false);
            },
        }
    );

    // Only show actions if current user is the author
    if (!currentUserId || currentUserId !== authorId) {
        return null;
    }

    const handleEdit = () => {
        router.push(`/posts/${postId}/edit`);
    };

    const handleDelete = async () => {
        await deletePost({ variables: { id: postId } });
    };

    return (
        <>
            <div className="flex items-center gap-3">
                {/* Edit Button */}
                <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    Edit
                </button>

                {/* Delete Button */}
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-600 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                    Delete
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3 dark:bg-red-900/50">
                    <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Post"
                message={`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`}
                isLoading={deleting}
            />
        </>
    );
}
