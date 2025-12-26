/**
 * Comments Section Component
 * Client component wrapper for displaying and adding comments
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_COMMENTS, GET_PROFILES_BY_IDS } from '@/graphql';
import type { GetCommentsResponse, GetCommentsVariables, Comment, Profile } from '@/graphql';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

interface CommentsSectionProps {
    postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
    const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());

    const { data, loading, error, refetch } = useQuery<GetCommentsResponse, GetCommentsVariables>(
        GET_COMMENTS,
        {
            variables: { postId, first: 50, offset: 0 },
        }
    );

    // Memoize comments to prevent unnecessary re-renders
    const comments = useMemo(
        () => data?.commentsCollection?.edges?.map(e => e.node) || [],
        [data?.commentsCollection?.edges]
    );

    // Fetch author profiles
    useEffect(() => {
        if (comments.length > 0) {
            const authorIds = [...new Set(comments.map(c => c.author_id))];
            // In a real app, you'd fetch these profiles
            // For now, we'll use a placeholder
            const profileMap = new Map<string, Profile>();
            authorIds.forEach(id => {
                profileMap.set(id, {
                    id,
                    display_name: null,
                    bio: null,
                    avatar_url: null,
                    website: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            });
            setProfiles(profileMap);
        }
    }, [comments]);

    return (
        <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                Comments {comments.length > 0 && `(${comments.length})`}
            </h2>

            {/* Comment Form */}
            <div className="mb-8">
                <CommentForm postId={postId} onSuccess={() => refetch()} />
            </div>

            {/* Loading State */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/50">
                    <p className="text-sm text-red-700 dark:text-red-200">
                        Failed to load comments
                    </p>
                </div>
            )}

            {/* Comments List */}
            {!loading && !error && (
                <CommentList
                    comments={comments}
                    postId={postId}
                    profiles={profiles}
                    onRefresh={() => refetch()}
                />
            )}
        </section>
    );
}
