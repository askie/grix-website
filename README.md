# Cloudflare Product Website Skeleton

This repository contains a minimal, production-oriented code skeleton for a Cloudflare-hosted product marketing website with an admin CMS boundary.

## Scope Boundary

- Public website: marketing pages, multilingual routes, SEO, CTA conversion.
- Admin website: content editing and publishing workflow.
- API boundary: public read-only endpoints vs admin protected endpoints.

Out of scope in this project:

- Product user registration/login
- Product business APIs
- Product core runtime features

## Structure

- `src/pages`: public and admin routes
- `src/layouts`: public/admin layout boundaries
- `src/templates`: template-level page rendering
- `src/components/public`: public-only UI components
- `src/components/admin`: admin-only UI components (React islands)
- `functions/api/public`: published-content API surface
- `functions/api/admin`: authenticated content-management API surface
- `functions/shared`: auth/db/repository/service/validator helpers
- `db/migrations`: D1 schema migrations
- `db/seeds`: bootstrap content seeds

## Quick Start

```bash
npm install
npm run dev
```

## Verification Commands

```bash
npm run check
npm run build
```
