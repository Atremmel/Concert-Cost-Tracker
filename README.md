# Concert Cost Tracker

Track concert spending, fun ratings, and value metrics. Built with Next.js, Tailwind CSS, daisyUI, Supabase, and Recharts.

## Local setup

1. Copy `.env.local.example` to `.env.local`
2. Open Supabase → your project → **Settings → API Keys**
3. Copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the **legacy anon** public key (starts with `eyJ…`) into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Run `npm install` then `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

Restart the dev server after changing `.env.local`.

**Never** put a service role or secret key in `.env.local`.

## Deploy to Vercel

### 1. Push this repo to GitHub

Your code should be on the `main` branch at:

`https://github.com/Atremmel/Concert-Cost-Tracker`

### 2. Import into Vercel

1. Sign in at [vercel.com](https://vercel.com) (use **Continue with GitHub**).
2. Click **Add New → Project**.
3. Import **Concert-Cost-Tracker**.
4. Framework should auto-detect as **Next.js** (build: `npm run build`).

### 3. Add environment variables in Vercel

Before deploying, add these under **Environment Variables**:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase **anon** public key (`eyJ…`) |

Enable for **Production** and **Preview**. Do not add the service role key.

### 4. Deploy

Click **Deploy**. Vercel will give you a live URL like `https://concert-cost-tracker.vercel.app`.

### 5. Configure Supabase Auth for your live URL

In Supabase → **Authentication** → **URL configuration**:

- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** add:
  - `https://your-app.vercel.app/**`
  - `http://localhost:3000/**`

Without this, login may fail on the deployed site.

**After changing env vars in Vercel, redeploy** (Deployments → … → Redeploy).

### 6. Test

Open your Vercel URL, sign up or log in, add a concert, and check the dashboard.

## Features

- **Setlists** — Paste a song list or upload a `.txt` / image when adding a concert, or edit later from the concert detail page.
- **Find Tickets** — Search artist and location; opens Ticketmaster, StubHub, SeatGeek, and more in new tabs to compare prices.
- **Venue Map** — Map of every logged venue (uses OpenStreetMap geocoding; fill in venue + city for best results).

### Supabase Storage

The `setlists` bucket is created by migration. If uploads fail locally, run migrations or apply `supabase/migrations/20260519120000_concert_features.sql` in the Supabase SQL editor.

## Troubleshooting “API error” or login fails

Supabase auth logs showing **401** almost always mean the wrong API key:

1. Supabase → **Settings → API Keys** → under **Legacy API Keys**, copy the **anon** `public` key (long JWT starting with `eyJ`).
2. Put it in `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY` (local) or in Vercel env vars (production).
3. Restart `npm run dev` locally, or **redeploy** on Vercel after saving env vars.
4. Do **not** use the `service_role` or `secret` key in the app.

If the error persists on Vercel only, confirm both env vars are set for Production and you redeployed.

## Tech stack

- Next.js 15 (App Router)
- Tailwind CSS + daisyUI
- Supabase (Auth + Postgres + Storage)
- Recharts
- Leaflet (venue map)
