# LEOVANDYZ CODEBASE

A modern developer workspace to discover, customize, preview, and share UI components, multi-section templates, code snippets, and curated multi-file source code archives (Public Scrape Library).

## Architecture Overview

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Lucide React SVG icons, JSZip.
- **Database & Auth**: Live provisioned Firebase Firestore + Google Sign-In (`firebase-applet-config.json` & hardened `firestore.rules`), plus portable PostgreSQL/Supabase migration schema (`supabase/migrations/001_schema.sql`).
- **Isolated Code Sandbox**: `<iframe sandbox="allow-scripts">` with strict Content Security Policy (`connect-src 'none'`), responsive viewport controls (Desktop, Tablet, Mobile), zoom, background switcher, and postMessage console bridging.
- **Public Scrape Library**: Curated multi-file code archives published by the platform owner with directory tree navigation, entry-file selection, license/source attribution, and ZIP bundle export.
- **Owner Studio (`/owner`)**: Complete administrative control center covering Dashboard Telemetry, Component Manager & Builder, Template Manager & Visual Landing Builder, Snippet Manager, Scrape Manager (with safe ZIP archive extraction & path-traversal protection), Category Manager, Asset Manager, User Role Management, Platform Settings, and Immutable Audit Logs.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` if customizing environment variables.
3. Run the development server on port 3000:
   ```bash
   npm run dev
   ```
4. Run security and unit tests:
   ```bash
   npx --yes tsx --test tests/unit/security.test.ts tests/security/firestore.rules.test.ts
   ```

## Deploying to Vercel

1. Push the repository to GitHub/GitLab/Bitbucket and import it into Vercel.
2. `vercel.json` is pre-configured with SPA rewrites (`/(.*) -> /index.html`) and security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
3. Build command: `npm run build`
4. Output directory: `dist`
