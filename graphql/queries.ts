/**
 * GraphQL Queries
 * All GraphQL queries for the blog application
 * Uses Supabase's pg_graphql API with Relay Connection spec
 */

import { gql } from '@apollo/client';

// ============================================
// POST QUERIES
// ============================================

/**
 * Query to fetch paginated posts using Supabase's collection pattern
 * Uses edges/node structure per Relay Connection specification
 */
export const GET_POSTS = gql`
  query GetPosts($first: Int!, $offset: Int, $orderBy: [postsOrderBy!], $filter: postsFilter) {
    postsCollection(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      edges {
        node {
          id
          title
          body
          excerpt
          featured_image
          status
          author_id
          created_at
          updated_at
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Query to fetch paginated published posts with offset-based pagination
 * Better for page number display
 */
export const GET_POSTS_WITH_OFFSET = gql`
  query GetPostsWithOffset($first: Int!, $offset: Int, $orderBy: [postsOrderBy!]) {
    postsCollection(
      first: $first, 
      offset: $offset, 
      orderBy: $orderBy,
      filter: { status: { eq: "published" } }
    ) {
      edges {
        node {
          id
          title
          body
          excerpt
          featured_image
          status
          author_id
          created_at
          updated_at
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
    # Separate query to get total count of published posts
    postsCount: postsCollection(filter: { status: { eq: "published" } }) {
      edges {
        __typename
      }
    }
  }
`;

/**
 * Query to fetch a single post by ID with author profile
 */
export const GET_POST_BY_ID = gql`
  query GetPostById($id: UUID!) {
    postsCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          id
          title
          body
          excerpt
          featured_image
          status
          author_id
          created_at
          updated_at
        }
      }
    }
  }
`;

/**
 * Query to fetch all post IDs for static generation (only published)
 */
export const GET_ALL_POST_IDS = gql`
  query GetAllPostIds {
    postsCollection(first: 1000, filter: { status: { eq: "published" } }) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

/**
 * Query to fetch posts by author (includes drafts for the author)
 */
export const GET_POSTS_BY_AUTHOR = gql`
  query GetPostsByAuthor($authorId: UUID!, $first: Int!, $offset: Int) {
    postsCollection(
      first: $first, 
      offset: $offset, 
      filter: { author_id: { eq: $authorId } },
      orderBy: [{ created_at: DescNullsLast }]
    ) {
      edges {
        node {
          id
          title
          body
          excerpt
          status
          created_at
          updated_at
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

/**
 * Search posts using full-text search
 */
export const SEARCH_POSTS = gql`
  query SearchPosts($searchQuery: String!, $first: Int!, $offset: Int) {
    postsCollection(
      first: $first,
      offset: $offset,
      filter: { 
        status: { eq: "published" },
        or: [
          { title: { ilike: $searchQuery } },
          { body: { ilike: $searchQuery } }
        ]
      },
      orderBy: [{ created_at: DescNullsLast }]
    ) {
      edges {
        node {
          id
          title
          body
          excerpt
          author_id
          created_at
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

// ============================================
// PROFILE QUERIES
// ============================================

/**
 * Get user profile by ID
 */
export const GET_PROFILE = gql`
  query GetProfile($id: UUID!) {
    profilesCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          id
          display_name
          bio
          avatar_url
          website
          created_at
          updated_at
        }
      }
    }
  }
`;

/**
 * Get multiple profiles (for post authors)
 */
export const GET_PROFILES_BY_IDS = gql`
  query GetProfilesByIds($ids: [UUID!]!) {
    profilesCollection(filter: { id: { in: $ids } }) {
      edges {
        node {
          id
          display_name
          avatar_url
        }
      }
    }
  }
`;

// ============================================
// TAG QUERIES
// ============================================

/**
 * Get all tags
 */
export const GET_TAGS = gql`
  query GetTags {
    tagsCollection(orderBy: [{ name: AscNullsLast }]) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;

/**
 * Get posts by tag slug
 */
export const GET_POSTS_BY_TAG = gql`
  query GetPostsByTag($tagSlug: String!, $first: Int!, $offset: Int) {
    tagsCollection(filter: { slug: { eq: $tagSlug } }, first: 1) {
      edges {
        node {
          id
          name
          slug
          post_tagsCollection {
            edges {
              node {
                post_id
              }
            }
          }
        }
      }
    }
  }
`;

// ============================================
// COMMENT QUERIES
// ============================================

/**
 * Get comments for a post
 */
export const GET_COMMENTS = gql`
  query GetComments($postId: UUID!, $first: Int!, $offset: Int) {
    commentsCollection(
      filter: { post_id: { eq: $postId }, status: { eq: "approved" } },
      first: $first,
      offset: $offset,
      orderBy: [{ created_at: AscNullsLast }]
    ) {
      edges {
        node {
          id
          body
          author_id
          parent_id
          created_at
          updated_at
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

/**
 * Get comment count for a post
 */
export const GET_COMMENT_COUNT = gql`
  query GetCommentCount($postId: UUID!) {
    commentsCollection(
      filter: { post_id: { eq: $postId }, status: { eq: "approved" } }
    ) {
      edges {
        __typename
      }
    }
  }
`;

// ============================================
// NOTIFICATION QUERIES
// ============================================

/**
 * Get notifications for current user
 */
export const GET_NOTIFICATIONS = gql`
  query GetNotifications($first: Int!, $offset: Int) {
    notificationsCollection(
      first: $first,
      offset: $offset,
      orderBy: [{ created_at: DescNullsLast }]
    ) {
      edges {
        node {
          id
          type
          title
          message
          read
          data
          created_at
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

/**
 * Get unread notification count
 */
export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query GetUnreadNotificationCount {
    notificationsCollection(filter: { read: { eq: false } }) {
      edges {
        __typename
      }
    }
  }
`;
