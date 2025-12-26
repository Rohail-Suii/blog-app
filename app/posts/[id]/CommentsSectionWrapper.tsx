/**
 * CommentsSection Wrapper
 * Client component wrapper for CommentsSection
 */

'use client';

import { CommentsSection } from '@/components/comments';

interface CommentsSectionWrapperProps {
    postId: string;
}

export function CommentsSectionWrapper({ postId }: CommentsSectionWrapperProps) {
    return <CommentsSection postId={postId} />;
}
