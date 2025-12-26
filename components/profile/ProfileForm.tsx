/**
 * Profile Form Component
 * Edit user profile with avatar, bio, and links
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { UPDATE_PROFILE } from '@/graphql';
import type { UpdateProfileResponse, UpdateProfileVariables, Profile } from '@/graphql';

const profileSchema = z.object({
    display_name: z.string().max(100, 'Name must be less than 100 characters').optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    avatar_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            display_name: profile.display_name || '',
            bio: profile.bio || '',
            avatar_url: profile.avatar_url || '',
            website: profile.website || '',
        },
    });

    const [updateProfile, { loading }] = useMutation<UpdateProfileResponse, UpdateProfileVariables>(
        UPDATE_PROFILE,
        {
            onCompleted() {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                router.refresh();
            },
            onError(err) {
                setError(err.message || 'Failed to update profile');
            },
        }
    );

    const onSubmit = async (data: ProfileFormData) => {
        setError(null);
        setSuccess(false);

        await updateProfile({
            variables: {
                id: profile.id,
                display_name: data.display_name || undefined,
                bio: data.bio || undefined,
                avatar_url: data.avatar_url || undefined,
                website: data.website || undefined,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/50">
                    <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
            )}

            {success && (
                <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/50">
                    <p className="text-sm text-green-700 dark:text-green-200">
                        Profile updated successfully!
                    </p>
                </div>
            )}

            {/* Avatar Preview */}
            <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.display_name || 'Profile'}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            <span className="text-2xl font-medium text-gray-600 dark:text-gray-300">
                                {(profile.display_name || 'U')[0].toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Avatar URL
                    </label>
                    <input
                        {...register('avatar_url')}
                        type="url"
                        id="avatar_url"
                        placeholder="https://example.com/avatar.jpg"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    />
                    {errors.avatar_url && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.avatar_url.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Display Name */}
            <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Name
                </label>
                <input
                    {...register('display_name')}
                    type="text"
                    id="display_name"
                    placeholder="Your name"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {errors.display_name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.display_name.message}
                    </p>
                )}
            </div>

            {/* Bio */}
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                </label>
                <textarea
                    {...register('bio')}
                    id="bio"
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="mt-1 block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {errors.bio && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.bio.message}
                    </p>
                )}
            </div>

            {/* Website */}
            <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Website
                </label>
                <input
                    {...register('website')}
                    type="url"
                    id="website"
                    placeholder="https://yourwebsite.com"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {errors.website && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.website.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || loading || !isDirty}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting || loading ? (
                        <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
