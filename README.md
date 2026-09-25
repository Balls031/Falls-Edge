# Falls Edge

Falls Edge Home Building — a [Next.js](https://nextjs.org) site for showcasing home listings, floor plans, open houses, and 3D walkthroughs.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment

Copy your Supabase keys into a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=choose-a-strong-key
```

`ADMIN_PASSWORD` is the initial key for `/admin`. It is checked on the server only; a successful login sets a
signed HttpOnly cookie (30 days) and every API route that writes data requires it.

The password can be changed from **Admin → Settings → Security**. Once changed, it is stored as a scrypt hash
in the `site_settings` table (key `adminPasswordHash`) and `ADMIN_PASSWORD` is no longer used. To recover from a
forgotten password, delete that row in Supabase and the env var applies again.

If these are not set, the site falls back to the local JSON files in `data/` so it can be run without a database.

## Deploy

Deployed on [Vercel](https://vercel.com). Set the same environment variables under the project's Settings → Environment Variables.
