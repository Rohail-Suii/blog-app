/**
 * GraphQL Types
 * TypeScript types for GraphQL queries and mutations
 * Updated for Supabase's pg_graphql Relay Connection spec
 */

// ============================================
// BASE TYPES
// ============================================

export interface Post {
  id: string;
  title: string;
  body: string;
  excerpt: string | null;
  featured_image: string | null;
  status: 'draft' | 'published';
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  body: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'new_comment' | 'new_post' | 'mention' | 'system';
  title: string;
  message: string | null;
  read: boolean;
  data: Record<string, unknown>;
  created_at: string;
}

// ============================================
// RELAY CONNECTION TYPES
// ============================================

export interface PostEdge {
  node: Post;
  __typename?: string;
}

export interface ProfileEdge {
  node: Profile;
}

export interface TagEdge {
  node: Tag;
}

export interface CommentEdge {
  node: Comment;
}

export interface NotificationEdge {
  node: Notification;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface PostsCollection {
  edges: PostEdge[];
  pageInfo: PageInfo;
}

export interface ProfilesCollection {
  edges: ProfileEdge[];
}

export interface TagsCollection {
  edges: TagEdge[];
}

export interface CommentsCollection {
  edges: CommentEdge[];
  pageInfo: PageInfo;
}

export interface NotificationsCollection {
  edges: NotificationEdge[];
  pageInfo: PageInfo;
}

// ============================================
// QUERY RESPONSE TYPES
// ============================================

export interface GetPostsResponse {
  postsCollection: PostsCollection;
}

export interface GetPostsWithOffsetResponse {
  postsCollection: PostsCollection;
  postsCount?: {
    edges: Array<{ __typename: string }>;
  };
}

export interface GetPostByIdResponse {
  postsCollection: {
    edges: PostEdge[];
  };
}

export interface GetAllPostIdsResponse {
  postsCollection: {
    edges: Array<{ node: { id: string } }>;
  };
}

export interface GetPostsByAuthorResponse {
  postsCollection: PostsCollection;
}

export interface SearchPostsResponse {
  postsCollection: PostsCollection;
}

export interface GetProfileResponse {
  profilesCollection: {
    edges: ProfileEdge[];
  };
}

export interface GetTagsResponse {
  tagsCollection: TagsCollection;
}

export interface GetCommentsResponse {
  commentsCollection: CommentsCollection;
}

export interface GetCommentCountResponse {
  commentsCollection: {
    edges: Array<{ __typename: string }>;
  };
}

export interface GetNotificationsResponse {
  notificationsCollection: NotificationsCollection;
}

export interface GetUnreadNotificationCountResponse {
  notificationsCollection: {
    edges: Array<{ __typename: string }>;
  };
}

// ============================================
// MUTATION RESPONSE TYPES
// ============================================

export interface CreatePostResponse {
  insertIntopostsCollection: {
    records: Post[];
  };
}

export interface UpdatePostResponse {
  updatepostsCollection: {
    records: Post[];
  };
}

export interface DeletePostResponse {
  deleteFrompostsCollection: {
    records: Array<{ id: string }>;
  };
}

export interface UpdateProfileResponse {
  updateprofilesCollection: {
    records: Profile[];
  };
}

export interface CreateProfileResponse {
  insertIntoprofilesCollection: {
    records: Profile[];
  };
}

export interface CreateTagResponse {
  insertIntotagsCollection: {
    records: Tag[];
  };
}

export interface CreateCommentResponse {
  insertIntocommentsCollection: {
    records: Comment[];
  };
}

export interface UpdateCommentResponse {
  updatecommentsCollection: {
    records: Comment[];
  };
}

export interface DeleteCommentResponse {
  deleteFromcommentsCollection: {
    records: Array<{ id: string }>;
  };
}

export interface MarkNotificationReadResponse {
  updatenotificationsCollection: {
    records: Array<{ id: string; read: boolean }>;
  };
}

// ============================================
// QUERY VARIABLES
// ============================================

export type OrderDirection = 'AscNullsFirst' | 'AscNullsLast' | 'DescNullsFirst' | 'DescNullsLast';

export interface GetPostsVariables {
  first: number;
  offset?: number;
  orderBy?: Array<{ [key: string]: OrderDirection }>;
  filter?: Record<string, unknown>;
}

export interface GetPostsWithOffsetVariables {
  first: number;
  offset: number;
  orderBy?: Array<{ [key: string]: OrderDirection }>;
}

export interface GetPostByIdVariables {
  id: string;
}

export interface GetPostsByAuthorVariables {
  authorId: string;
  first: number;
  offset?: number;
}

export interface SearchPostsVariables {
  searchQuery: string;
  first: number;
  offset?: number;
}

export interface GetProfileVariables {
  id: string;
}

export interface GetCommentsVariables {
  postId: string;
  first: number;
  offset?: number;
}

export interface GetNotificationsVariables {
  first: number;
  offset?: number;
}

// ============================================
// MUTATION VARIABLES
// ============================================

export interface CreatePostVariables {
  title: string;
  body: string;
  author_id: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published';
}

export interface UpdatePostVariables {
  id: string;
  title?: string;
  body?: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published';
}

export interface DeletePostVariables {
  id: string;
}

export interface UpdateProfileVariables {
  id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
}

export interface CreateTagVariables {
  name: string;
  slug: string;
}

export interface CreateCommentVariables {
  post_id: string;
  author_id: string;
  body: string;
  parent_id?: string;
}

export interface UpdateCommentVariables {
  id: string;
  body: string;
}

export interface DeleteCommentVariables {
  id: string;
}

export interface MarkNotificationReadVariables {
  id: string;
}
