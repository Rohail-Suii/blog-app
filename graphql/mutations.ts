/**
 * GraphQL Mutations
 * All GraphQL mutations for the blog application
 * Uses Supabase's pg_graphql API
 */

import { gql } from '@apollo/client';

// ============================================
// POST MUTATIONS
// ============================================

/**
 * Mutation to create a new post
 * Requires authentication - author_id will be set from the session
 */
export const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!, 
    $body: String!, 
    $author_id: UUID!,
    $excerpt: String,
    $featured_image: String,
    $status: String
  ) {
    insertIntopostsCollection(objects: [{ 
      title: $title, 
      body: $body, 
      author_id: $author_id,
      excerpt: $excerpt,
      featured_image: $featured_image,
      status: $status
    }]) {
      records {
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
`;

/**
 * Mutation to update an existing post
 * Only the author can update their own posts (enforced by RLS)
 */
export const UPDATE_POST = gql`
  mutation UpdatePost(
    $id: UUID!, 
    $title: String, 
    $body: String,
    $excerpt: String,
    $featured_image: String,
    $status: String
  ) {
    updatepostsCollection(
      filter: { id: { eq: $id } }
      set: { 
        title: $title, 
        body: $body,
        excerpt: $excerpt,
        featured_image: $featured_image,
        status: $status
      }
    ) {
      records {
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
`;

/**
 * Mutation to delete a post
 * Only the author can delete their own posts (enforced by RLS)
 */
export const DELETE_POST = gql`
  mutation DeletePost($id: UUID!) {
    deleteFrompostsCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;

// ============================================
// PROFILE MUTATIONS
// ============================================

/**
 * Update user profile
 */
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $id: UUID!,
    $display_name: String,
    $bio: String,
    $avatar_url: String,
    $website: String
  ) {
    updateprofilesCollection(
      filter: { id: { eq: $id } }
      set: {
        display_name: $display_name,
        bio: $bio,
        avatar_url: $avatar_url,
        website: $website
      }
    ) {
      records {
        id
        display_name
        bio
        avatar_url
        website
        updated_at
      }
    }
  }
`;

/**
 * Create user profile (if not auto-created)
 */
export const CREATE_PROFILE = gql`
  mutation CreateProfile(
    $id: UUID!,
    $display_name: String,
    $bio: String,
    $avatar_url: String,
    $website: String
  ) {
    insertIntoprofilesCollection(objects: [{
      id: $id,
      display_name: $display_name,
      bio: $bio,
      avatar_url: $avatar_url,
      website: $website
    }]) {
      records {
        id
        display_name
        bio
        avatar_url
        website
      }
    }
  }
`;

// ============================================
// TAG MUTATIONS
// ============================================

/**
 * Create a new tag
 */
export const CREATE_TAG = gql`
  mutation CreateTag($name: String!, $slug: String!) {
    insertIntotagsCollection(objects: [{ name: $name, slug: $slug }]) {
      records {
        id
        name
        slug
      }
    }
  }
`;

/**
 * Add tag to post
 */
export const ADD_TAG_TO_POST = gql`
  mutation AddTagToPost($post_id: UUID!, $tag_id: UUID!) {
    insertIntopost_tagsCollection(objects: [{ post_id: $post_id, tag_id: $tag_id }]) {
      records {
        post_id
        tag_id
      }
    }
  }
`;

/**
 * Remove tag from post
 */
export const REMOVE_TAG_FROM_POST = gql`
  mutation RemoveTagFromPost($post_id: UUID!, $tag_id: UUID!) {
    deleteFrompost_tagsCollection(
      filter: { post_id: { eq: $post_id }, tag_id: { eq: $tag_id } }
    ) {
      records {
        post_id
        tag_id
      }
    }
  }
`;

// ============================================
// COMMENT MUTATIONS
// ============================================

/**
 * Create a new comment
 */
export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $post_id: UUID!, 
    $author_id: UUID!, 
    $body: String!,
    $parent_id: UUID
  ) {
    insertIntocommentsCollection(objects: [{
      post_id: $post_id,
      author_id: $author_id,
      body: $body,
      parent_id: $parent_id
    }]) {
      records {
        id
        post_id
        author_id
        body
        parent_id
        status
        created_at
      }
    }
  }
`;

/**
 * Update a comment
 */
export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: UUID!, $body: String!) {
    updatecommentsCollection(
      filter: { id: { eq: $id } }
      set: { body: $body }
    ) {
      records {
        id
        body
        updated_at
      }
    }
  }
`;

/**
 * Delete a comment
 */
export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: UUID!) {
    deleteFromcommentsCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;

// ============================================
// NOTIFICATION MUTATIONS
// ============================================

/**
 * Mark notification as read
 */
export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: UUID!) {
    updatenotificationsCollection(
      filter: { id: { eq: $id } }
      set: { read: true }
    ) {
      records {
        id
        read
      }
    }
  }
`;

/**
 * Mark all notifications as read
 */
export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead($user_id: UUID!) {
    updatenotificationsCollection(
      filter: { user_id: { eq: $user_id }, read: { eq: false } }
      set: { read: true }
    ) {
      records {
        id
        read
      }
    }
  }
`;

/**
 * Delete a notification
 */
export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: UUID!) {
    deleteFromnotificationsCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;
