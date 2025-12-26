/**
 * Signup Page
 * Server component that renders the signup form
 */

import { SignupForm } from '@/components/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account - Blog App',
  description: 'Create a new Blog App account to start publishing your blog posts.',
  openGraph: {
    title: 'Create Account - Blog App',
    description: 'Create a new Blog App account to start publishing your blog posts.',
    type: 'website',
  },
};

export default function SignupPage() {
  return <SignupForm />;
}
