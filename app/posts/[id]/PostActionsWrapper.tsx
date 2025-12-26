/**
 * PostActions Wrapper
 * Client component wrapper for PostActions
 */

'use client';

import { PostActions } from '@/components/posts';

interface PostActionsWrapperProps {
    postId: string;
    postTitle: string;
    authorId: string;
    currentUserId?: string;
}

export function PostActionsWrapper(props: PostActionsWrapperProps) {
    return <PostActions {...props} />;
}
