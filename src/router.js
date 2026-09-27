import { RULES } from "./router-data.js";

function matchesDomain(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function hasQueryKey(url, key) {
  return url.searchParams.has(key);
}

function isArticlePath(url, rule) {
  if (rule.pathPatterns) {
    return rule.pathPatterns.some((pattern) => new RegExp(pattern).test(url.pathname));
  }

  return url.pathname.split("/").filter(Boolean).length >= 2;
}

function withQuery(url, rule) {
  const { key, value } = rule;
  if (hasQueryKey(url, key) && url.searchParams.get(key) === value) {
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
export function rewriteUrl(input, { siteEnabled = true } = {}) {
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
  if (!siteEnabled) {
    return null;
  }
  let rewritten = null;

  for (const rule of RULES.query) {
    if (matchesDomain(hostname, rule.domain) && isArticlePath(url, rule)) {
      rewritten = withQuery(url, rule);
      break;
    }
  }

  if (!rewritten) {
    for (const rule of RULES.slashQuery) {
      if (matchesDomain(hostname, rule.domain) && isArticlePath(url, rule)) {
        url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
        rewritten = withQuery(url, rule);
        break;
      }
    }
  }

  if (!rewritten) {
    for (const rule of RULES.path) {
      if (matchesDomain(hostname, rule.domain) && isArticlePath(url, rule)) {
        rewritten = withPathSuffix(url, rule.suffix);
        break;
      }
    }
  }

  return rewritten?.toString() ?? null;
}
