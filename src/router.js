import { RULES } from "./router-data.js";

function matchesDomain(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function hasQueryKey(url, key) {
  return url.searchParams.has(key);
}

function withQuery(url, key, value) {
  if (hasQueryKey(url, key)) {
    return null;
  }

  url.searchParams.set(key, value);
  return url;
}

function withPathSuffix(url, suffix) {
  const path = url.pathname.replace(/\/+$/, "");
  if (path.endsWith(`/${suffix}`) || path === suffix) {
    return null;
  }

  url.pathname = `${path}/${suffix}`;
  return url;
}

/**
 * Return the full-page URL for a supported article, or null when unchanged.
 */
export function rewriteUrl(input) {
  let url;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return null;
  }

  const hostname = url.hostname.toLowerCase();
  let rewritten = null;

  for (const rule of RULES.query) {
    if (matchesDomain(hostname, rule.domain)) {
      rewritten = withQuery(url, rule.key, rule.value);
      break;
    }
  }

  if (!rewritten) {
    for (const rule of RULES.slashQuery) {
      if (matchesDomain(hostname, rule.domain)) {
        if (hasQueryKey(url, rule.key)) {
          return null;
        }
        url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
        rewritten = withQuery(url, rule.key, rule.value);
        break;
      }
    }
  }

  if (!rewritten) {
    for (const rule of RULES.path) {
      if (matchesDomain(hostname, rule.domain)) {
        rewritten = withPathSuffix(url, rule.suffix);
        break;
      }
    }
  }

  return rewritten?.toString() ?? null;
}
