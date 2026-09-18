/*
 * Runtime configuration.
 *
 * The customer-facing pages are deployed as a Render Static Site, while the
 * API + admin remain a Render Web Service. Pages therefore need to know where
 * the API lives. When the page is served by the API host itself (or locally),
 * same-origin requests are used and API_ORIGIN stays empty.
 */
(function () {
  // The Render Web Service that hosts the API, uploads and the admin pages.
  var API_HOST = 'https://cathrine.onrender.com';

  var host = window.location.hostname;
  var pageIsLocal = host === 'localhost' || host === '127.0.0.1' || host === '';
  var apiIsLocal = /^https?:\/\/(localhost|127\.0\.0\.1)([:/]|$)/i.test(API_HOST);

  // Use same-origin requests when this page is served by the API host itself
  // (the web service serves admin.html and can serve the customer pages too),
  // and when running locally against a production API_HOST -- so `npm start`
  // on localhost never talks to the live API by accident.
  var sameOrigin = window.location.origin === API_HOST || (pageIsLocal && !apiIsLocal);

  var origin = sameOrigin ? '' : API_HOST;

  // Paths that are served by the API host and must be prefixed when the page
  // is served from the static site.
  var REMOTE_PREFIXES = ['/api/', '/uploads/', '/gallery_images/', '/products_images/'];

  window.API_ORIGIN = origin;

  // Build an absolute URL for an API endpoint.
  window.apiUrl = function (path) {
    if (!path) return path;
    if (/^https?:\/\//i.test(path)) return path;
    return origin + path;
  };

  // Build an absolute URL for an image / uploaded file returned by the API.
  window.mediaUrl = function (path) {
    if (!path) return path;
    if (/^(https?:)?\/\//i.test(path) || path.indexOf('data:') === 0) return path;
    for (var i = 0; i < REMOTE_PREFIXES.length; i++) {
      if (path.indexOf(REMOTE_PREFIXES[i]) === 0) return origin + path;
    }
    return path;
  };

  // Product/gallery/category/settings data is baked into the static build as
  // JSON (see build-static.sh) so browsing the site never has to wait on the
  // API service waking up from Render's free-tier sleep. Each page asks for
  // this data through fetchData(name, apiPath) instead of calling the API
  // directly. On the static site this reads /data/<name>.json, which was
  // fetched from the live API at build time. If that file is missing (local
  // dev, or the very first deploy before a build has run) it falls back to
  // calling the live API, so nothing breaks -- it just won't be cold-start-proof
  // until the next publish.
  window.fetchData = async function (name, apiPath) {
    if (origin) {
      try {
        const staticRes = await fetch('/data/' + name + '.json');
        if (staticRes.ok) return staticRes.json();
      } catch (e) { /* fall through to live API */ }
    }
    const res = await fetch(window.apiUrl(apiPath));
    if (!res.ok) throw new Error('Failed to load ' + apiPath);
    return res.json();
  };

  // The admin pages (admin.html, order-tracking.html) are served by the web
  // service, not the static site. Rewrite links to them at page load.
  var ADMIN_PAGES = ['admin.html', 'order-tracking.html'];
  if (origin) {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        for (var i = 0; i < ADMIN_PAGES.length; i++) {
          if (href === ADMIN_PAGES[i] || href === '/' + ADMIN_PAGES[i]) {
            a.setAttribute('href', origin + '/' + ADMIN_PAGES[i]);
          }
        }
      });
    });
  }
})();
