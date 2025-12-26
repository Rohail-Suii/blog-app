/**
 * Sitemap Generator
 * Generates dynamic sitemap for SEO
 */

import { MetadataRoute } from 'next';
import { createServerApolloClient } from '@/lib/apollo/client';
import { GET_ALL_POST_IDS } from '@/graphql';
import type { GetAllPostIdsResponse } from '@/graphql';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic pages (posts)
  try {
    const client = createServerApolloClient();
    const { data } = await client.query<GetAllPostIdsResponse>({
      query: GET_ALL_POST_IDS,
    });

    const posts = data?.postsCollection?.edges?.map(edge => edge.node) || [];

    const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${baseUrl}/posts/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticPages, ...postPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
