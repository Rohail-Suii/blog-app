/**
 * Authentication Utilities
 * Helper functions for authentication operations
 */

import { createClient } from '@/lib/supabase/client';
import { getBaseURL } from '@/lib/utils';

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getBaseURL()}/auth/callback?redirectTo=/auth/login`,
    },
  });

  return { data, error };
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getBaseURL()}/auth/callback`,
    },
  });

  return { data, error };
}

/**
 * Sign in with magic link (passwordless OTP)
 */
export async function signInWithOTP(email: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseURL()}/auth/callback?redirectTo=/auth/login`,
    },
  });

  return { data, error };
}

/**
 * Verify OTP code
 */
export async function verifyOTP(email: string, token: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  return { data, error };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  return { error };
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  return { user, error };
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = createClient();

  const { data: { session }, error } = await supabase.auth.getSession();

  return { session, error };
}
