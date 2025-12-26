/**
 * Providers Component
 * Wraps the app with all necessary providers (Auth, Apollo, etc.)
 */

'use client';

import { AuthProvider } from '@/lib/auth';
import { ApolloProvider } from '@/lib/apollo/provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a single QueryClient instance per session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider>
        <AuthProvider>{children}</AuthProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
}
