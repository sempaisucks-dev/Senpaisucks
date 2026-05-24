Vercel Deployment Checklist

- Environment variables (set in Vercel project Settings → Environment Variables):
  - `DATABASE_URL` — Neon/Postgres connection string
  - `UPSTASH_REDIS_REST_URL` — Upstash REST URL
  - `UPSTASH_REDIS_REST_TOKEN` — Upstash token
  - `NEXT_PUBLIC_SITE_URL` — https://your-vercel-domain.vercel.app
  - `NEXT_PUBLIC_UMAMI_URL` — Umami script base URL (if used)
  - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` — Umami site id (if used)
  - `PRIVATE_SOURCES_URL` — Private upstream source (do NOT expose publicly)

- Build settings:
  - Framework Preset: `Next.js`
  - Install Command: `npm ci` (or `npm install`)
  - Build Command: `npm run build`
  - Output Directory: (default)

- Files to add to `public/`:
  - Google Search Console verification file (`google******.html`) placed at `/public/` root.

- Additional checks:
  - Ensure `app/sitemap.ts` is reachable at `/sitemap.xml` after deploy.
  - Ensure `/robots.txt` is reachable and disallows `/api/`, `/user/`, `/admin/`.
  - Confirm Umami script loads only in production (layout.tsx uses NODE_ENV check).
  - Add any required redirects or rewrites in Vercel dashboard if needed.

- Post-deploy:
  - Verify sitemap exposure in Google Search Console.
  - Submit sitemap URL to Google Search Console.
  - Verify robots.txt via `https://your-domain/robots.txt`.
