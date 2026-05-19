# Concert Cost Tracker

Track concert spending, fun ratings, and value metrics. Built with Next.js, Tailwind CSS, daisyUI, Supabase, and Recharts.

## Local setup

1. Copy `.env.local.example` to `.env.local`
2. Open Supabase → your project → **Settings → API Keys**
3. Copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the **publishable** key (or legacy anon public key) into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
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
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase publishable or anon public key |

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

### 6. Test

Open your Vercel URL, sign up or log in, add a concert, and check the dashboard.

## Tech stack

- Next.js 15 (App Router)
- Tailwind CSS + daisyUI
- Supabase (Auth + Postgres)
- Recharts
