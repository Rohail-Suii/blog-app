/**
 * Apollo Provider Component
 * Wraps the application with ApolloProvider for GraphQL support
 * Uses a singleton pattern to prevent multiple client instances
 */

'use client';

import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './client';

interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

export function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}

// Export with alternative name for the providers.tsx import
export { ApolloProviderWrapper as ApolloProvider };
