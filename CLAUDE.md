# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

26 Store Pekanbaru is an e-commerce application for sports equipment built with Next.js 15, React 19, TypeScript, and Tailwind CSS. The project is automatically synced with v0.dev deployments and hosted on Vercel.

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Package Manager**: pnpm (lockfile present)
- **Development**: Turbo mode enabled for dev server

### Application Structure
The app follows a dual-interface pattern:
- **Customer Interface**: Product catalog, cart, checkout, orders, and profile
- **Admin Interface**: Dashboard, product management, sales entry, customer management, and reporting

### Key Components
- `components/customer-layout.tsx`: Main layout for customer-facing pages with navigation, search, and mobile menu
- `components/admin-layout.tsx`: Admin dashboard layout with sidebar navigation and responsive design
- `components/ui/`: Complete shadcn/ui component library for consistent UI elements

### Route Structure
- `/`: Customer home page with product catalog
- `/cart`: Shopping cart management
- `/checkout`: Checkout process
- `/orders`: Order history
- `/profile`: User profile
- `/admin`: Admin dashboard with analytics
- `/admin/products`: Product management
- `/admin/sales`: Sales entry
- `/admin/customers`: Customer management
- `/admin/admins`: Admin user management
- `/admin/reports`: Sales reporting

## Development Commands

```bash
# Development
npm run dev          # Start dev server with turbo mode
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Note: Project uses pnpm lockfile but npm scripts
```

## Configuration Notes

### Critical Configuration Issues
- **next.config.mjs**: ESLint and TypeScript build errors are disabled (`ignoreDuringBuilds: true`, `ignoreBuildErrors: true`)
- **Image optimization**: Disabled (`unoptimized: true`)
- These settings should be addressed for production use

### Current Limitations
- No authentication system implemented
- All data is hard-coded (no API integration)
- No state management beyond local component state
- Admin routes are not protected
- No form validation despite zod being available

## Data Patterns

### Product Structure
```typescript
{
  id: number
  name: string
  price: string | number
  image: string
  rating: number
  inStock: boolean
}
```

### Cart Item Structure
```typescript
{
  id: number
  name: string
  price: number
  quantity: number
  image: string
}
```

## Development Workflow

This project is managed through v0.dev:
1. Make changes on v0.dev chat interface
2. Deploy from v0.dev
3. Changes auto-sync to this repository
4. Vercel deploys from repository

When working locally, be aware that changes may be overwritten by v0.dev syncing.

