/**
 * Apollo Client Configuration
 * Sets up Apollo Client for GraphQL queries with Supabase
 * Handles authentication headers and caching
 */

import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createClient } from '@/lib/supabase/client';

// HTTP link pointing to Supabase GraphQL endpoint
const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
});

// Auth link to inject the API key and auth token
const authLink = setContext(async (_, { headers }) => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return {
    headers: {
      ...headers,
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Authorization': session?.access_token
        ? `Bearer ${session.access_token}`
        : `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  };
});

// Apollo Client instance for client-side usage
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          postsCollection: {
            // Merge function for offset-based pagination
            keyArgs: ['orderBy', 'filter'],
            merge(existing, incoming) {
              // For Relay-style collections, just replace with incoming
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

/**
 * Creates a server-side Apollo Client for SSR/SSG
 * Uses the service role key for server-side operations
 */
export function createServerApolloClient(accessToken?: string) {
  const serverHttpLink = createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': accessToken
        ? `Bearer ${accessToken}`
        : `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  return new ApolloClient({
    link: serverHttpLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
    ssrMode: true,
  });
}
