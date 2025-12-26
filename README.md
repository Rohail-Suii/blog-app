# Blog App

A production-ready blog application built with Next.js 16, Supabase, GraphQL, and Tailwind CSS. Features authentication, SEO optimization, and a clean, modern UI.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-GraphQL-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## 📋 Table of Contents

- [Overview](#overview)
- [Why This Project Exists](#why-this-project-exists)
- [Architecture Decisions](#architecture-decisions)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Performance Goals](#performance-goals)
- [Security Considerations](#security-considerations)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [GraphQL API](#graphql-api)
- [Authentication](#authentication)
- [Rendering Strategy](#rendering-strategy)
- [SEO & Metadata](#seo--metadata)
- [Project Structure](#project-structure)
- [Development](#development)
- [Local Development Tips](#local-development-tips)
- [Trade-offs & Limitations](#trade-offs--limitations)
- [Future Improvements](#future-improvements)
- [Deployment](#deployment)

## Overview

Blog App is a modern, full-stack blog platform that allows users to read, write, and share blog posts. It's built with a focus on performance, SEO, and user experience.

### Key Highlights

- ⚡ **Fast Performance**: Static Generation with ISR for optimal loading times
- 🔒 **Secure**: Row Level Security (RLS) enforced at the database level
- 🔍 **SEO Optimized**: Dynamic metadata, Open Graph tags, and semantic HTML
- 📱 **Responsive**: Mobile-first design with Tailwind CSS
- 🎨 **Dark Mode**: Automatic dark mode support

## Why This Project Exists

This project was built as a reference implementation of a modern Next.js + Supabase stack, focusing on:

- **Clean architecture** — Clear separation of concerns with modular components
- **Real-world auth flows** — Email/password, OAuth, and magic links
- **SEO & performance** — Production-grade optimization out of the box
- **Production-ready patterns** — Best practices that scale

## Architecture Decisions

This project follows modern Next.js and backend best practices with a clear separation of concerns.

### Why Next.js App Router?
- Enables Server Components for reduced JS bundle size
- Native support for streaming, metadata, and ISR
- Cleaner mental model for SSR vs SSG boundaries

### Why Supabase GraphQL?
- Strongly typed schema generated from PostgreSQL
- Fine-grained access control using RLS
- Avoids REST overfetching/underfetching issues
- Relay Connection spec for consistent pagination

### Why Apollo Client?
- Built-in caching and pagination support
- Optimistic UI updates for instant feedback
- Predictable data flow for complex UIs
- Excellent DevTools for debugging

### Why ISR over Full SSR?
- Near-static performance with real-time freshness
- Lower server cost and compute usage
- Better SEO and TTFB
- Automatic background revalidation

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Database** | Supabase (PostgreSQL) |
| **API** | GraphQL via Supabase (pg_graphql) |
| **Client** | Apollo Client |
| **Authentication** | Supabase Auth |
| **Styling** | Tailwind CSS 4 |
| **Forms** | React Hook Form + Zod |
| **State** | React Query + Apollo Cache |

## Features

### Authentication
- ✅ Email & Password login/signup
- ✅ Google OAuth integration
- ✅ Magic Link (passwordless) login
- ✅ Protected routes with middleware
- ✅ User profile dropdown

### Blog Features
- ✅ Paginated post list (5 posts per page)
- ✅ Post detail view with full content
- ✅ Create new posts (authenticated only)
- ✅ Optimistic UI updates
- ✅ Skeleton loaders for loading states

### SEO & Performance
- ✅ Dynamic metadata generation
- ✅ Open Graph & Twitter cards
- ✅ Canonical URLs
- ✅ Static Generation with ISR
- ✅ Image optimization

## Performance Goals

The application is optimized for real-world performance:

| Metric | Target | Description |
|--------|--------|-------------|
| **Lighthouse Score** | 90+ | Performance, SEO, Accessibility |
| **Time to First Byte** | < 200ms | For static/ISR pages |
| **First Contentful Paint** | < 1.5s | Initial content render |
| **JavaScript Bundle** | Minimal | Server Components reduce client JS |

> 💡 Performance was tested using Lighthouse and Web Vitals in Chrome DevTools.

### Optimization Strategies

- **Server Components** — Default, with client components only when needed
- **Static Generation** — Pre-render pages at build time
- **ISR** — Background revalidation every 60 seconds
- **Apollo Cache** — Reduces redundant network requests

## Security Considerations

Security is built into every layer of the application:

| Layer | Security Measure |
|-------|------------------|
| **Database** | Row Level Security (RLS) enforced at PostgreSQL level |
| **Auth** | Server-side session validation for protected routes |
| **API** | Public GraphQL limited to read-only; mutations require auth |
| **Client** | No client-side trust for author assignment |
| **Environment** | Sensitive keys never exposed to the browser |

### RLS Policies

```sql
-- Anyone can read posts (public blog)
CREATE POLICY "Public read" ON posts FOR SELECT USING (true);

-- Only authenticated users can create posts
CREATE POLICY "Auth insert" ON posts FOR INSERT 
  WITH CHECK (auth.uid() = author_id);

-- Authors can only modify their own posts
CREATE POLICY "Author update" ON posts FOR UPDATE 
  USING (auth.uid() = author_id);
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Supabase account (or local Supabase CLI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials.

4. **Run database migrations**
   ```bash
   # Using Supabase CLI
   supabase db push

   # Or run the SQL manually in Supabase Dashboard
   # See: supabase/migrations/20251225000001_posts_schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required: Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Site URL (for OAuth callbacks)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create new)
3. Navigate to **Settings > API**
4. Copy the **Project URL** and **anon public** key

## Supabase Setup

### Database Schema

The application uses a `posts` table with the following structure:

```sql
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Row Level Security (RLS)

RLS policies ensure data security:

| Policy | Operation | Rule |
|--------|-----------|------|
| Public Read | SELECT | Anyone can read all posts |
| Auth Insert | INSERT | Only authenticated users can create posts |
| Author Update | UPDATE | Authors can only update their own posts |
| Author Delete | DELETE | Authors can only delete their own posts |

### Running Migrations

Using Supabase CLI:
```bash
supabase db push
```

Or run the SQL in `supabase/migrations/20251225000001_posts_schema.sql` directly in the Supabase SQL Editor.

### Enabling Google OAuth

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable **Google** provider
3. Add your Google OAuth credentials
4. Add redirect URL to Google Cloud Console:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

## GraphQL API

The app uses Supabase's auto-generated GraphQL API (pg_graphql) with Relay Connection specification.

### Endpoint
```
https://your-project.supabase.co/graphql/v1
```

### Available Queries

```graphql
# Fetch paginated posts
query GetPosts($first: Int!, $offset: Int!, $orderBy: [postsOrderBy!]) {
  postsCollection(first: $first, offset: $offset, orderBy: $orderBy) {
    edges {
      node {
        id
        title
        body
        author_id
        created_at
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}

# Fetch single post
query GetPostById($id: UUID!) {
  postsCollection(filter: { id: { eq: $id } }, first: 1) {
    edges {
      node {
        id
        title
        body
        author_id
        created_at
      }
    }
  }
}
```

### Available Mutations

```graphql
# Create a new post
mutation CreatePost($title: String!, $body: String!, $author_id: UUID!) {
  insertIntopostsCollection(objects: [
    { title: $title, body: $body, author_id: $author_id }
  ]) {
    records {
      id
      title
    }
  }
}
```

## Authentication

### Authentication Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│ Supabase Auth│────▶│  Database   │
│  (Browser)  │◀────│   Service    │◀────│ (PostgreSQL)│
└─────────────┘     └──────────────┘     └─────────────┘
      │                    │
      │  1. Login/Signup   │
      │──────────────────▶│
      │                    │
      │  2. JWT Token      │
      │◀──────────────────│
      │                    │
      │  3. API Requests   │
      │   (with Bearer)    │
      │──────────────────▶│
```

### Protected Routes

The following routes require authentication:
- `/posts/new` - Create new post

Unauthenticated users are redirected to `/auth/login`.

### Auth Methods

| Method | Description |
|--------|-------------|
| Email/Password | Traditional login with email and password |
| Google OAuth | Sign in with Google account |
| Magic Link | Passwordless email authentication |

## Rendering Strategy

### Request Flow

```
Browser
   ↓
CDN (Static Page / ISR Cache)
   ↓
Next.js Server (if revalidation needed)
   ↓
Supabase GraphQL API
   ↓
PostgreSQL Database
```

### Strategy by Page

| Page | Strategy | Revalidation | Reason |
|------|----------|--------------|--------|
| Homepage (`/`) | SSG + ISR | 60 seconds | Fast, SEO-friendly |
| Post Detail (`/posts/[id]`) | SSG + ISR | 60 seconds | Shareable, crawlable |
| Create Post (`/posts/new`) | SSR | Every request | Auth-dependent |
| Auth Pages | Static | - | No dynamic data |

### Why This Strategy?

- **Homepage & Post Detail**: Static generation provides the best performance. ISR ensures content stays fresh without full rebuilds.
- **Create Post**: Requires SSR for auth check on every request.
- **Auth Pages**: Static since they don't depend on user state.

## SEO & Metadata

### Dynamic Metadata

Each page generates its own metadata using `generateMetadata()`:

```typescript
export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  return {
    title: post.title,
    description: extractExcerpt(post.body, 160),
    openGraph: { ... },
    twitter: { ... },
  };
}
```

### SEO Features

- ✅ Dynamic `<title>` and `<meta description>`
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card support
- ✅ Canonical URLs
- ✅ Semantic HTML structure
- ✅ Robots meta tags

## Project Structure

```
blog-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── providers.tsx      # Client providers (Auth, Apollo)
│   ├── globals.css        # Global styles
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   └── posts/             # Blog post pages
│       ├── [id]/          # Post detail (dynamic)
│       └── new/           # Create post
├── components/            # React components
│   ├── auth/              # Auth components (LoginForm, UserMenu)
│   ├── layout/            # Layout components (Header, Footer)
│   ├── posts/             # Post components (PostCard, PostForm)
│   └── ui/                # UI components (Skeleton, Pagination)
├── graphql/               # GraphQL queries & mutations
│   ├── queries.ts
│   ├── mutations.ts
│   └── types.ts
├── lib/                   # Utility libraries
│   ├── apollo/            # Apollo Client setup
│   ├── auth/              # Auth utilities & context
│   ├── supabase/          # Supabase clients
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript type definitions
│   └── database.types.ts
├── supabase/              # Supabase configuration
│   └── migrations/        # Database migrations
├── public/                # Static assets
├── middleware.ts          # Next.js middleware
├── next.config.ts         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Prettier**: Code formatting (recommended)

### Testing GraphQL

You can test GraphQL queries in the Supabase Dashboard:
1. Go to **API Docs > GraphQL**
2. Open the GraphiQL explorer
3. Write and test your queries

## Local Development Tips

### Using Supabase CLI

For the best local development experience:

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Reset database (useful for testing)
supabase db reset

# Generate types from schema
supabase gen types typescript --local > types/database.types.ts
```

### Debugging GraphQL

1. Use Apollo DevTools browser extension
2. Check Network tab for GraphQL requests
3. Use Supabase Dashboard GraphiQL for query testing

### Environment Tips

- GraphQL schema updates are automatic after migrations
- Use `supabase status` to see local endpoints
- Check `supabase logs` for debugging auth issues

## Trade-offs & Limitations

Every project makes trade-offs. Here's what we chose and why:

| Trade-off | Reasoning |
|-----------|-----------|
| **No batched mutations** | Keeps queries explicit and debuggable |
| **No full-text search** | PostgreSQL FTS planned for future |
| **No comments system** | Scoped for MVP; easy to add later |
| **No image uploads** | Supabase Storage recommended for production |
| **No edit/delete UI** | Backend supports it; UI can be added |
| **Client-side pagination only** | Server-side cursor pagination available if needed |

## Future Improvements

Planned enhancements for the next iteration:

- [ ] **Full-text search** using PostgreSQL FTS
- [ ] **Tagging & categories** for post organization
- [ ] **Comments** with moderation system
- [ ] **Draft & publish workflow** for content management
- [ ] **Role-based access** (admin/editor roles)
- [ ] **Image uploads** via Supabase Storage
- [ ] **E2E testing** with Playwright
- [ ] **Edit/Delete post UI** for authors
- [ ] **User profiles** with avatars
- [ ] **Email notifications** for new posts

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Supabase Production Checklist

- [ ] Update redirect URLs for OAuth
- [ ] Enable email confirmations (optional)
- [ ] Configure custom SMTP for emails
- [ ] Set up SSL/custom domain
- [ ] Review RLS policies
- [ ] Enable Point-in-Time Recovery
- [ ] Configure connection pooling

---

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js, Supabase, and GraphQL**
