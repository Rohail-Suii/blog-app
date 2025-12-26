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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[720px] mx-auto py-12">
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-500">Draft in {user?.email}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSubmitting || loading}
            className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
            onClick={() => {
              setValue('status', 'published');
              handleSubmit(onSubmit)();
            }}
          >
            Publish
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-900"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input
          {...register('title')}
          type="text"
          placeholder="Title"
          className="w-full text-4xl md:text-5xl font-serif font-bold placeholder-gray-300 border-l border-gray-300 pl-4 ml-[-1rem] focus:outline-none focus:border-gray-800 transition-colors bg-transparent"
        />
        <textarea
          {...register('excerpt')}
          rows={1}
          placeholder="Tell your story..."
          className="w-full text-xl text-gray-500 font-serif placeholder-gray-300 border-none p-0 focus:ring-0 resize-none bg-transparent"
        />
      </div>

      <div className="mt-8">
        <RichTextEditor
          content={watch('body')}
          onChange={(value) => setValue('body', value, { shouldValidate: true })}
          placeholder=""
        />
      </div>
    </form>
  );
}
