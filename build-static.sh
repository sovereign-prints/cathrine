#!/usr/bin/env bash
# Builds the customer-facing static site into ./dist for a Render Static Site.
# The admin pages (admin.html, order-tracking.html) are deliberately excluded --
# they stay on the Render Web Service together with the API.
set -euo pipefail

rm -rf dist
mkdir -p dist

PAGES=(index.html products.html gallery.html quote.html)
ASSETS=(styles.css config.js app.js products.js gallery.js quote.js logo.png)

for f in "${PAGES[@]}" "${ASSETS[@]}"; do
  cp "public/$f" "dist/$f"
done

# The API host can be overridden at build time (set API_HOST in the Render
# static service's environment). Otherwise the value in public/config.js is used.
if [ -n "${API_HOST:-}" ]; then
  HOST_NO_SLASH="${API_HOST%/}"
  sed -i "s|var API_HOST = '[^']*';|var API_HOST = '${HOST_NO_SLASH}';|" dist/config.js
  echo "API_HOST set to ${HOST_NO_SLASH}"
fi

cp -r public/images dist/images
[ -d public/products_images ] && cp -r public/products_images dist/products_images

# ---------------------------------------------------------------------------
# Data snapshot.
#
# products.html, gallery.html and the homepage used to call the live API
# (GET /api/products, /api/gallery, /api/categories, /api/settings) on every
# visit. The web service is on Render's free plan, which sleeps after 15
# minutes idle, so that first call could cost visitors a 10-30s cold start --
# even though the page itself (static, CDN-hosted) loaded instantly. Baking
# a snapshot of this data into the build means browsing the site never has to
# wait on the API waking up.
#
# The snapshot is only as fresh as the last publish: admin edits save to the
# database immediately as before, but only reach the static site's data files
# after the next build. Trigger a rebuild from the admin Website tab's
# "Update website now" button after making content changes you want visitors
# to see.
#
# The source host for this data is the same API_HOST used above.
# ---------------------------------------------------------------------------
DATA_HOST="${API_HOST:-https://cathrine.onrender.com}"
DATA_HOST="${DATA_HOST%/}"
mkdir -p dist/data

# A failed fetch here must NOT ship as an empty [] -- that would replace a
# working product/gallery listing with a blank one the moment this build is
# published. Since dist/ is rebuilt from scratch every time, there is no
# previous snapshot to fall back to locally, so instead the whole build fails.
# Render then keeps serving the last successfully published version, and the
# admin can just retry "Update website now" once the backend is responsive.
fetch_json() {
  local path="$1" out="$2"
  echo "Fetching ${DATA_HOST}${path} -> dist/data/${out}"
  if ! curl -fsS --retry 3 --retry-delay 5 --max-time 60 "${DATA_HOST}${path}" -o "dist/data/${out}"; then
    echo "ERROR: failed to fetch ${DATA_HOST}${path} after retries. Aborting build so the" >&2
    echo "live site is not replaced with empty data. Try 'Update website now' again once" >&2
    echo "the backend (${DATA_HOST}) is responding." >&2
    exit 1
  fi
  # -f already makes curl fail (and hit the branch above) on a non-2xx status,
  # so a non-empty file here reflects a real 2xx JSON response from the API.
  if [ ! -s "dist/data/${out}" ]; then
    echo "ERROR: ${DATA_HOST}${path} returned an empty response. Aborting build so the live" >&2
    echo "site is not replaced with empty data." >&2
    exit 1
  fi
}

fetch_json "/api/products" "products.json"
fetch_json "/api/gallery" "gallery.json"
fetch_json "/api/categories" "categories.json"
fetch_json "/api/settings" "settings.json"

# Anything not matched by a file falls back to the homepage.
cp dist/index.html dist/404.html

echo "Static site built into ./dist"
