/**
 * Profile Card Component
 * Displays user profile information
 */

import Link from 'next/link';
import type { Profile } from '@/graphql';

interface ProfileCardProps {
    profile: Profile;
    postCount?: number;
    showLink?: boolean;
}

export function ProfileCard({ profile, postCount, showLink = true }: ProfileCardProps) {
    const content = (
        <div className="flex items-center gap-4">
            {/* Avatar */}
            {profile.avatar_url ? (
                <img
                    src={profile.avatar_url}
                    alt={profile.display_name || 'User'}
                    className="h-12 w-12 rounded-full object-cover"
                />
            ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        {(profile.display_name || 'U')[0].toUpperCase()}
                    </span>
                </div>
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 dark:text-white">
                    {profile.display_name || 'Anonymous'}
                </p>
                {profile.bio && (
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {profile.bio}
                    </p>
                )}
                {postCount !== undefined && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {postCount} post{postCount !== 1 ? 's' : ''}
                    </p>
                )}
            </div>
        </div>
    );

    if (showLink) {
        return (
            <Link
                href={`/users/${profile.id}`}
                className="block rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
                {content}
            </Link>
        );
    }

    return <div className="p-3">{content}</div>;
}
