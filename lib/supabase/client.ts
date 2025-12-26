/**
 * Supabase Browser Client
 * Creates a Supabase client for use in Client Components
 * Uses @supabase/ssr for proper cookie handling in Next.js
 */

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

/**
 * Creates a Supabase client for browser/client-side usage
 * This client handles auth state and cookie management automatically
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
