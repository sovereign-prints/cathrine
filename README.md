# Sovereign Prints

Custom printing, vinyl, and branding website with a full admin dashboard, quote/order tracking, and invoice generation. Built with Node.js/Express and PostgreSQL (Neon).

## Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL (via [Neon](https://neon.tech)), accessed through `db.js`
- **Auth:** Password-protected admin login, JWT session cookie (`jsonwebtoken`, `cookie-parser`)
- **File uploads:** `multer`, images stored as blobs in Postgres and served from `/uploads/:id` (so uploads survive redeploys on ephemeral hosting like Render)
- **Frontend:** Static HTML/CSS/vanilla JS in `public/` (no build step)

## Pages

| Path | Purpose |
|---|---|
| `/` (`index.html`) | Homepage |
| `/products.html` | Product catalog with quantity-based pricing tiers |
| `/gallery.html` | Portfolio gallery |
| `/quote.html` | Customer quote request form |
| `/admin.html` | Admin dashboard — manage products, gallery, settings (password-protected) |
| `/order-tracking.html` | Admin quote-to-order-to-invoice workflow (password-protected) |

The admin login is a small circular icon in the footer of every customer-facing page (bottom-right), not a prominent header button.

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — your Postgres connection string (Neon or otherwise)
   - `ADMIN_PASSWORD` — password for the admin dashboard
   - `ADMIN_JWT_SECRET` — a long random string for signing session tokens
3. Start the dev server (auto-restarts on file changes):
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`

On first connection, `db.js` automatically creates the required tables and seeds default products/templates if the database is empty — no manual migration step needed.

## Deployment (Render)

The app is configured to run as a Render Web Service (`render.yaml`):

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables** (set manually in the Render dashboard, not auto-provisioned):
  - `DATABASE_URL` — your Neon connection string
  - `ADMIN_PASSWORD`
  - `ADMIN_JWT_SECRET` (Render can auto-generate this)
  - `NODE_ENV=production`

`.github/workflows/keepalive.yml` pings the deployed site every 14 minutes to prevent Render's free-tier instance from spinning down.

## Order & quote workflow

1. Customer submits a quote via `/quote.html` → stored as a pending quote.
2. Admin reviews it in Order Tracking → "Convert to Order" creates a project linked to the quote.
3. Admin updates the order's progress via the status dropdown on each order card (`quoted → processing → complete → delivered`, or `on-hold` / `cancelled`).
4. Once an order's status is set to **complete**, an "Invoice (PDF)" button appears, generating a printable invoice (browser print-to-PDF).
5. Quotes can also be printed directly as PDFs from the Quote Builder — this also saves the quote to the list.

## Data management

The Order Tracking page's "Data Management" tab lets you export all quotes/orders as JSON for backup purposes. All data is persisted in Postgres — nothing is stored on the local filesystem except uploaded image blobs (which also live in Postgres).
