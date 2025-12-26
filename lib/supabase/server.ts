/**
 * Supabase Server Client
 * Creates a Supabase client for use in Server Components, Route Handlers, and Server Actions
 * Uses @supabase/ssr with Next.js cookies() for proper session management
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

/**
 * Creates a Supabase client for server-side usage
 * Handles cookies properly for authentication in Server Components
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // This can happen in Server Components where we can't set cookies
            // The middleware will handle the session refresh
          }
        },
      },
    }
  );
}

/**
 * Gets the current authenticated user from the server
 * Returns null if no user is authenticated
 */
export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

/**
 * Gets the current session from the server
 * Returns null if no session exists
 */
export async function getSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return null;
  }
  
  return session;
}
