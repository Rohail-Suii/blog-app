/**
 * Login Page
 * Server component that renders the login form
 */

import { LoginForm } from '@/components/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Blog App',
  description: 'Sign in to your Blog App account to create and manage your blog posts.',
  openGraph: {
    title: 'Sign In - Blog App',
    description: 'Sign in to your Blog App account to create and manage your blog posts.',
    type: 'website',
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
