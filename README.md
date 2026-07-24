# Beer Die

Stats, standings, and live games for the Beer Die league. Data comes from a Google Sheet via an
Apps Script API — there is no database.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` (already present for local dev) with:

```
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
ADMIN_PASSWORD=your-password-here
```

- `NEXT_PUBLIC_APPS_SCRIPT_URL` — the deployed Apps Script web app URL. Server components fetch
  this directly; the `/live` page polls it client-side via JSONP (`src/lib/jsonp.ts`) to avoid CORS.
- `ADMIN_PASSWORD` — gate for `/admin`. Sessions are a signed (HMAC-SHA256), httpOnly cookie set by
  `/api/admin/login`; enforced by `src/middleware.ts`.

## Admin writes

The Apps Script deployment currently only exposes read actions (`get_standings`, `get_players`,
`get_player`, `get_partnerships`, `get_partnership`, `get_news`, `get_pbp_history`, and the
no-action live-game endpoint). The `/admin/players` and `/admin/news` forms POST to
`/api/admin/players` and `/api/admin/news`, which attempt to call the Apps Script URL with
`action: "update_player"` / `action: "add_news"`. Until the Apps Script project adds a `doPost`
handler for those actions, saves will report a clear "not supported yet" error instead of silently
failing.

## Deploying to Netlify

1. Push this repo to GitHub and connect it in the Netlify dashboard (or `netlify init`).
2. Build command: `npm run build` · Publish directory: `.next` (already set in `netlify.toml`,
   which also declares the `@netlify/plugin-nextjs` runtime).
3. Add `NEXT_PUBLIC_APPS_SCRIPT_URL` and `ADMIN_PASSWORD` under Site settings → Environment
   variables.
4. Deploy. No database setup needed — all data comes from the Google Sheet.
