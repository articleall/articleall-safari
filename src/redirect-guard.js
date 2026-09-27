const WINDOW_MS = 5_000;
const MAX_REDIRECTS = 3;
const recentRedirects = new Map();

export function shouldRedirect(tabId, fromUrl, toUrl) {
  const now = Date.now();
  const recent = (recentRedirects.get(tabId) ?? []).filter(
    ({ timestamp }) => now - timestamp < WINDOW_MS,
  );

  if (recent.length >= MAX_REDIRECTS) {
    recentRedirects.set(tabId, recent);
    return false;
  }

  recent.push({ fromUrl, toUrl, timestamp: now });
  recentRedirects.set(tabId, recent);
  return true;
}

export function clearRedirects(tabId) {
  recentRedirects.delete(tabId);
}
