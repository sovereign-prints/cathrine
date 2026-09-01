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

# Anything not matched by a file falls back to the homepage.
cp dist/index.html dist/404.html

echo "Static site built into ./dist"
