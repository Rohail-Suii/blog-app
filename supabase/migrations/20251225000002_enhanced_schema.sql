-- Enhanced blog schema migration
-- Adds: draft/publish workflow, profiles, tags, comments, notifications, and full-text search

-- ============================================
-- 1. ENHANCE POSTS TABLE
-- ============================================

-- Add status column for draft/publish workflow
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' 
  CHECK (status IN ('draft', 'published'));

-- Add excerpt for post previews
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add featured image URL
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);

-- Update RLS policy for drafts - only authors see their own drafts
DROP POLICY IF EXISTS "Posts are publicly readable" ON public.posts;
CREATE POLICY "Published posts are publicly readable"
  ON public.posts
  FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

-- ============================================
-- 2. FULL-TEXT SEARCH
-- ============================================

-- Add search vector column (generated)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS search_vector tsvector 
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'C')
  ) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_posts_search ON public.posts USING GIN(search_vector);

-- Create search function
CREATE OR REPLACE FUNCTION search_posts(search_query TEXT)
RETURNS SETOF public.posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.posts
  WHERE search_vector @@ plainto_tsquery('english', search_query)
    AND status = 'published'
  ORDER BY ts_rank(search_vector, plainto_tsquery('english', search_query)) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. USER PROFILES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT CHECK (char_length(bio) <= 500),
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON public.profiles(display_name);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are publicly readable
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- ============================================
-- 4. TAGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 50),
  slug TEXT UNIQUE NOT NULL CHECK (char_length(slug) >= 1 AND char_length(slug) <= 60),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on slug
CREATE INDEX IF NOT EXISTS idx_tags_slug ON public.tags(slug);

-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Tags are publicly readable
CREATE POLICY "Tags are publicly readable"
  ON public.tags
  FOR SELECT
  USING (true);

-- Authenticated users can create tags
CREATE POLICY "Authenticated users can create tags"
  ON public.tags
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Grant permissions
GRANT SELECT ON public.tags TO anon;
GRANT SELECT, INSERT ON public.tags TO authenticated;

-- ============================================
-- 5. POST TAGS JUNCTION TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON public.post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON public.post_tags(tag_id);

-- Enable RLS
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- Post tags are publicly readable
CREATE POLICY "Post tags are publicly readable"
  ON public.post_tags
  FOR SELECT
  USING (true);

-- Authors can manage tags on their posts
CREATE POLICY "Authors can manage post tags"
  ON public.post_tags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_tags.post_id 
      AND posts.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_tags.post_id 
      AND posts.author_id = auth.uid()
    )
  );

-- Grant permissions
GRANT SELECT ON public.post_tags TO anon;
GRANT SELECT, INSERT, DELETE ON public.post_tags TO authenticated;

-- ============================================
-- 6. COMMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 2000),
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Approved comments are publicly readable
CREATE POLICY "Approved comments are publicly readable"
  ON public.comments
  FOR SELECT
  USING (status = 'approved' OR auth.uid() = author_id);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

-- Authors can update their own comments
CREATE POLICY "Authors can update their own comments"
  ON public.comments
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own comments
CREATE POLICY "Authors can delete their own comments"
  ON public.comments
  FOR DELETE
  USING (auth.uid() = author_id);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT ON public.comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;

-- ============================================
-- 7. NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_comment', 'new_post', 'mention', 'system')),
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System can insert notifications (via service role)
CREATE POLICY "System can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT INSERT ON public.notifications TO authenticated;

-- ============================================
-- 8. HELPER FUNCTIONS
-- ============================================

-- Function to get post count by tag
CREATE OR REPLACE FUNCTION get_tag_post_count(tag_slug TEXT)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*) INTO count
  FROM public.post_tags pt
  JOIN public.tags t ON t.id = pt.tag_id
  JOIN public.posts p ON p.id = pt.post_id
  WHERE t.slug = tag_slug AND p.status = 'published';
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification on new comment
CREATE OR REPLACE FUNCTION notify_on_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
  post_title TEXT;
BEGIN
  -- Get post author and title
  SELECT author_id, title INTO post_author_id, post_title
  FROM public.posts WHERE id = NEW.post_id;
  
  -- Don't notify if commenting on own post
  IF post_author_id != NEW.author_id THEN
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (
      post_author_id,
      'new_comment',
      'New comment on your post',
      'Someone commented on "' || post_title || '"',
      jsonb_build_object('post_id', NEW.post_id, 'comment_id', NEW.id)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for comment notifications
CREATE TRIGGER on_new_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW
  WHEN (NEW.status = 'approved')
  EXECUTE FUNCTION notify_on_new_comment();

-- ============================================
-- 9. TABLE COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE public.profiles IS 'User profile information extending auth.users';
COMMENT ON TABLE public.tags IS 'Tags for categorizing posts';
COMMENT ON TABLE public.post_tags IS 'Junction table linking posts to tags';
COMMENT ON TABLE public.comments IS 'Comments on posts with threading support';
COMMENT ON TABLE public.notifications IS 'User notifications for various events';

COMMENT ON COLUMN public.posts.status IS 'Post status: draft or published';
COMMENT ON COLUMN public.posts.excerpt IS 'Short excerpt for previews';
COMMENT ON COLUMN public.posts.featured_image IS 'URL to featured image';
COMMENT ON COLUMN public.posts.search_vector IS 'Full-text search vector (auto-generated)';
