/**
 * Comment List Component
 * Displays comments with author info
 */

'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CommentForm } from './CommentForm';
import type { Comment, Profile } from '@/graphql';
import { useAuth } from '@/lib/auth';

interface CommentWithProfile extends Comment {
    author?: Profile | null;
}

interface CommentItemProps {
    comment: CommentWithProfile;
    postId: string;
    profiles: Map<string, Profile>;
    onReplySuccess?: () => void;
}

function CommentItem({ comment, postId, profiles, onReplySuccess }: CommentItemProps) {
    const { user } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const author = profiles.get(comment.author_id);

    return (
        <div className="group">
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {author?.avatar_url ? (
                        <img
                            src={author.avatar_url}
                            alt={author.display_name || 'User'}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {(author?.display_name || 'U')[0].toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                            {author?.display_name || 'Anonymous'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                    </div>

                    <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {comment.body}
                    </p>

                    {/* Reply Button */}
                    {user && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="mt-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            Reply
                        </button>
                    )}

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3">
                            <CommentForm
                                postId={postId}
                                parentId={comment.id}
                                placeholder="Write a reply..."
                                onSuccess={() => {
                                    setShowReplyForm(false);
                                    onReplySuccess?.();
                                }}
                                onCancel={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface CommentListProps {
    comments: CommentWithProfile[];
    postId: string;
    profiles: Map<string, Profile>;
    onRefresh?: () => void;
}

export function CommentList({ comments, postId, profiles, onRefresh }: CommentListProps) {
    if (comments.length === 0) {
        return (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                <svg
                    className="mx-auto h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No comments yet. Be the first to comment!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    profiles={profiles}
                    onReplySuccess={onRefresh}
                />
            ))}
        </div>
    );
}
