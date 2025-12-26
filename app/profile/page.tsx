/**
 * Profile Page
 * User's own profile management
 */

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { createServerApolloClient } from '@/lib/apollo/client';
import { GET_PROFILE } from '@/graphql';
import type { GetProfileResponse, GetProfileVariables } from '@/graphql';
import { ProfileForm } from '@/components/profile/ProfileForm';

export const metadata: Metadata = {
    title: 'Your Profile - Blog App',
    description: 'Manage your profile settings',
};

async function getProfile(userId: string) {
    const client = createServerApolloClient();

    try {
        const { data } = await client.query<GetProfileResponse, GetProfileVariables>({
            query: GET_PROFILE,
            variables: { id: userId },
        });

        return data?.profilesCollection?.edges?.[0]?.node || null;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login?redirect=/profile');
    }

    const profile = await getProfile(user.id);

    // Create a default profile object if none exists
    const profileData = profile || {
        id: user.id,
        display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
        bio: null,
        avatar_url: user.user_metadata?.avatar_url || null,
        website: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Page Header */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Your Profile
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Manage your public profile information
                </p>
            </header>

            {/* Account Info */}
            <div className="mb-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                    Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
            </div>

            {/* Profile Form */}
            <ProfileForm profile={profileData} />
        </div>
    );
}
