/**
 * Post Form Component
 * Form for creating new blog posts with validation
 * Supports draft/publish workflow
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { CREATE_POST } from '@/graphql';
import type { CreatePostResponse, CreatePostVariables } from '@/graphql';
import { useAuth } from '@/lib/auth';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

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

export function PostForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      body: '',
      excerpt: '',
      featured_image: '',
      status: 'published',
    },
  });

  const status = watch('status');

  const [createPost, { loading }] = useMutation<CreatePostResponse, CreatePostVariables>(
    CREATE_POST,
    {
      update(cache, result) {
        const data = result.data;
        const created = data?.insertIntopostsCollection?.records?.[0];
        if (created) {
          // Evict the postsCollection field so lists will refetch
          cache.evict({ fieldName: 'postsCollection' });
          cache.gc();
        }
      },
      onCompleted(data) {
        const newPost = data?.insertIntopostsCollection?.records?.[0];
        if (newPost) {
          router.push(`/posts/${newPost.id}`);
          router.refresh();
        }
      },
      onError(err) {
        setError(err.message || 'Failed to create post. Please try again.');
      },
    }
  );

  const onSubmit = async (data: PostFormData) => {
    if (!user) {
      setError('You must be logged in to create a post.');
      return;
    }

    setError(null);

    await createPost({
      variables: {
        title: data.title,
        body: data.body,
        author_id: user.id,
        excerpt: data.excerpt || undefined,
        featured_image: data.featured_image || undefined,
        status: data.status,
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

      {/* Status Toggle */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Post Status
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {status === 'draft' ? 'Save as draft - only visible to you' : 'Publish immediately'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setValue('status', 'draft')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${status === 'draft'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
              }`}
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => setValue('status', 'published')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${status === 'published'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
              }`}
          >
            Publish
          </button>
        </div>
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
          className="input-magic mt-1"
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
          Excerpt <span className="text-gray-400">(optional - appears in post previews)</span>
        </label>
        <textarea
          {...register('excerpt')}
          id="excerpt"
          rows={2}
          placeholder="A short summary of your post..."
          className="input-magic mt-1 resize-none"
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
          className="input-magic mt-1"
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
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Content
        </label>
        <RichTextEditor
          content={watch('body')}
          onChange={(value) => setValue('body', value, { shouldValidate: true })}
          placeholder="Tell your story..."
        />
        {errors.body && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.body.message}
          </p>
        )}
      </div>

      {/* Author Info */}
      {
        user && (
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Publishing as:</span> {user.email}
            </p>
          </div>
        )
      }

      {/* Submit Button */}
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
          disabled={isSubmitting || loading}
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
              {status === 'draft' ? 'Saving...' : 'Publishing...'}
            </>
          ) : (
            status === 'draft' ? 'Save Draft' : 'Publish Post'
          )}
        </button>
      </div>
    </form >
  );
}
