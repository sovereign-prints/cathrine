# Sovereign Prints — Cold Start Fix Summary

## The problem

Sovereign Prints runs on two Render services:

- **`sovereign-prints`** (backend) — Node/Express + Postgres, on Render's **free plan**. Free-plan services sleep after 15 minutes idle and take **10–30+ seconds** to wake on the next request.
- **`sovereign-prints-site`** (static customer-facing site) — plain HTML/CSS/JS on Render's static/CDN tier, which never sleeps and loads instantly.

Visitors were still experiencing long load times despite the static site being fast, because the static pages called the live backend API on every visit.

## Stage 1 (done earlier): image cold start — fixed via Cloudinary

Originally, uploaded images were stored in Postgres and served through the backend (`/uploads/:id`). Every image request had to wake the sleeping backend, adding 10–30s to the first image load.

**Fix:** new image uploads now go directly to **Cloudinary** (via `multer-storage-cloudinary` in `server.js`), which has its own always-on CDN. Image URLs became `https://res.cloudinary.com/...` instead of backend-served paths — images now load in under 500ms, independent of whether the backend is awake. Old images already in the database still work via the original fallback route.

## Stage 2 (this fix): data cold start — the part Cloudinary didn't cover

Even with images fixed, `products.html`, `gallery.html`, and the homepage were still calling the live backend on every visit to get **product data, prices, descriptions, categories, and business/contact settings**:

- `GET /api/products`
- `GET /api/gallery`
- `GET /api/categories`
- `GET /api/settings`

Since that's the same sleeping free-tier backend, browsing the site still triggered the full 10–30s cold start — just on data instead of images.

### What was changed

1. **`build-static.sh`** — now fetches all four endpoints from the live backend **at build time** and writes the responses to `dist/data/products.json`, `gallery.json`, `categories.json`, `settings.json`, shipped alongside the static HTML/CSS/JS. If any fetch fails after retries, the **build aborts** rather than shipping empty/broken data — Render then keeps serving the last good published version.
2. **`public/config.js`** — added a `fetchData(name, apiPath)` helper. On the static site it reads the local `/data/<name>.json` snapshot; it only falls back to a live API call for local development or if a data file is unexpectedly missing.
3. **`public/products.js`, `public/gallery.js`, `public/app.js`** — switched from calling `fetch(apiUrl('/api/...'))` directly to using `fetchData(...)`, so browsing is served entirely from the CDN with no live backend dependency.
4. **Admin "Website" tab** (`public/admin.html`) — copy updated. Previously said content changes were "live immediately." Now explains that changes save immediately to the database, but the public site shows a snapshot that only updates when the admin clicks **"Update website now"**.
5. **`publish.js` / `render.yaml`** — comments updated to reflect that a rebuild is now required for *content* changes (products, prices, gallery, settings), not just layout/design changes. `AUTO_PUBLISH` stays **off** by default — publishing remains a deliberate, manual action via the existing button, not automatic on every save.

### Explicitly unchanged

Quote submission, order tracking, admin login, and all admin editing (adding/editing products, prices, images, gallery items, settings) still work exactly as before — live calls straight to the backend. Only the **public browsing experience** was changed.

## Verified live (sovereignprints.onrender.com)

- `/data/products.json`, `/data/gallery.json`, `/data/categories.json`, `/data/settings.json` all return `200 OK` and load in **27–48ms**.
- `products.html` and `gallery.html` render correctly (8 products, 8 gallery items) with **zero network calls to the backend** — confirmed via browser performance entries.

## The tradeoff to know

Content edits (new product, price change, gallery update, business details) save to the database instantly, as always — but won't appear on the public site until an admin clicks **"Update website now"** on the Website tab, which takes a few minutes to rebuild and redeploy. This is the necessary tradeoff for removing the cold start from browsing.

## If cold starts are still a concern elsewhere

The backend itself (`sovereign-prints`) is still on Render's free plan, so admin login, quote submission, and order tracking can still hit a cold-start delay on their first request after 15 minutes idle. Options if that becomes a problem:

- Upgrade `sovereign-prints` to a paid Render plan (~$7/mo, Starter) — eliminates all remaining cold starts, zero code changes.
- A keep-alive pinger hitting the backend periodically — free, but a workaround rather than a fix.
