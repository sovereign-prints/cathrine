/*
 * Static site publishing.
 *
 * The customer-facing pages are a Render Static Site built from this repo.
 * Product, gallery, category and settings content is baked into that build as
 * static JSON (see build-static.sh) rather than fetched from this API at
 * runtime, so browsing the site is never slowed down by this API service
 * waking up from Render's free-tier sleep. This means a rebuild is now needed
 * both for page/layout changes AND whenever product, price, gallery or
 * business-detail content changes and should reach customers.
 *
 * This module triggers that rebuild by calling the static service's Render
 * Deploy Hook. Calls are debounced so that a burst of admin edits results in a
 * single build rather than one per save. Publishing stays a deliberate,
 * admin-triggered action (the "Update website now" button on the Website tab)
 * rather than automatic on every save -- AUTO_PUBLISH is off by default.
 */

const DEPLOY_HOOK_URL = process.env.RENDER_DEPLOY_HOOK_URL || '';
// Wait this long after the last change before building, so a run of edits
// collapses into one deploy. Override with PUBLISH_DEBOUNCE_MS.
const DEBOUNCE_MS = parseInt(process.env.PUBLISH_DEBOUNCE_MS || '120000', 10);
// Automatic publishing after content changes. Off unless explicitly enabled,
// because content is already live without a rebuild.
const AUTO_PUBLISH = process.env.AUTO_PUBLISH === 'true';

let pendingTimer = null;
let pendingReason = null;
let inFlight = false;

const state = {
  configured: Boolean(DEPLOY_HOOK_URL),
  autoPublish: AUTO_PUBLISH,
  lastStatus: null,      // 'success' | 'failed' | null
  lastMessage: null,
  lastTriggeredAt: null,
  lastReason: null,
  scheduledFor: null
};

async function callDeployHook(reason) {
  if (!DEPLOY_HOOK_URL) {
    state.lastStatus = 'failed';
    state.lastMessage = 'No deploy hook configured. Set RENDER_DEPLOY_HOOK_URL.';
    return { ok: false, error: state.lastMessage };
  }
  if (inFlight) {
    return { ok: true, skipped: true, error: null };
  }

  inFlight = true;
  try {
    const res = await fetch(DEPLOY_HOOK_URL, { method: 'POST' });
    const body = await res.text();
    state.lastTriggeredAt = new Date().toISOString();
    state.lastReason = reason || 'manual';
    if (res.ok) {
      state.lastStatus = 'success';
      state.lastMessage = 'Website update started. It is usually live within a few minutes.';
      return { ok: true, error: null };
    }
    state.lastStatus = 'failed';
    state.lastMessage = `Render rejected the request (${res.status}). ${body.slice(0, 200)}`;
    return { ok: false, error: state.lastMessage };
  } catch (err) {
    state.lastStatus = 'failed';
    state.lastTriggeredAt = new Date().toISOString();
    state.lastMessage = `Could not reach Render: ${err.message}`;
    return { ok: false, error: state.lastMessage };
  } finally {
    inFlight = false;
  }
}

// Publish right now, bypassing the debounce (the admin "Update website" button).
async function publishNow(reason) {
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
    state.scheduledFor = null;
  }
  return callDeployHook(reason || 'manual');
}

// Queue a publish after a content change. No-op unless AUTO_PUBLISH is on.
function schedulePublish(reason) {
  if (!AUTO_PUBLISH || !DEPLOY_HOOK_URL) return;

  pendingReason = reason || 'content change';
  if (pendingTimer) clearTimeout(pendingTimer);
  state.scheduledFor = new Date(Date.now() + DEBOUNCE_MS).toISOString();

  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    state.scheduledFor = null;
    callDeployHook(pendingReason).catch(() => { /* state already recorded */ });
  }, DEBOUNCE_MS);

  // Don't hold the process open just for a pending deploy.
  if (pendingTimer.unref) pendingTimer.unref();
}

function getStatus() {
  return { ...state, publishPending: Boolean(pendingTimer) };
}

module.exports = { publishNow, schedulePublish, getStatus };
