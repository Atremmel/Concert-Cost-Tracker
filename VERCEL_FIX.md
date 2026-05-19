# Fix the live site on Vercel (API error / 401)

Your **local** app is fixed. The live site at https://concert-cost-tracker.vercel.app still needs the correct API key in Vercel.

## Steps (about 2 minutes)

1. Open [Vercel → Concert-Cost-Tracker → Settings → Environment Variables](https://vercel.com/dashboard).
2. Set or update:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://hloxppqhtfkkvxmuzwfo.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your **anon** key from Supabase (starts with `eyJ…`)
     - Supabase → **Settings → API Keys → Legacy API Keys → anon public**
     - Use the same value as in your local `.env.local` (not the `sb_publishable_…` key).
3. Enable both variables for **Production** and **Preview**.
4. **Deployments** → latest deployment → **⋯** → **Redeploy** (required after changing env vars).
5. After deploy finishes, open:
   - https://concert-cost-tracker.vercel.app/api/health  
     You should see `"ok": true` and `"keyType": "anon"`.
6. Try sign up / log in again.

## Supabase redirect URLs

In Supabase → **Authentication** → **URL configuration**:

- **Site URL:** `https://concert-cost-tracker.vercel.app`
- **Redirect URLs:** include
  - `https://concert-cost-tracker.vercel.app/**`
  - `http://localhost:3000/**`
  - `http://localhost:3001/**`
  - `http://localhost:3002/**`
