-- Create posts table for the blog application
-- This table stores all blog posts with proper relationships to auth.users

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 500),
  body TEXT NOT NULL CHECK (char_length(body) >= 1),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create an index on author_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);

-- Create an index on created_at for efficient ordering/pagination
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read posts (public access)
CREATE POLICY "Posts are publicly readable"
  ON public.posts
  FOR SELECT
  USING (true);

-- RLS Policy: Only authenticated users can insert posts
CREATE POLICY "Authenticated users can create posts"
  ON public.posts
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

-- RLS Policy: Authors can update their own posts
CREATE POLICY "Authors can update their own posts"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- RLS Policy: Authors can delete their own posts
CREATE POLICY "Authors can delete their own posts"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions for authenticated users
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;

-- Comment on table for documentation
COMMENT ON TABLE public.posts IS 'Blog posts table with RLS policies for public read and authenticated write access';
COMMENT ON COLUMN public.posts.id IS 'Unique identifier for the post';
COMMENT ON COLUMN public.posts.title IS 'Post title (required, max 500 chars)';
COMMENT ON COLUMN public.posts.body IS 'Post body content (required)';
COMMENT ON COLUMN public.posts.author_id IS 'Reference to the auth.users table';
COMMENT ON COLUMN public.posts.created_at IS 'Timestamp when the post was created';
COMMENT ON COLUMN public.posts.updated_at IS 'Timestamp when the post was last updated';
