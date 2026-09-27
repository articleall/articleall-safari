const QUERY_RULES = new Map([
  ["kompas.com", ["page", "all"]],
  ["suara.com", ["page", "all"]],
  ["tribunnews.com", ["page", "all"]],
  ["grid.id", ["page", "all"]],
  ["viva.co.id", ["page", "all"]],
  ["intipseleb.com", ["page", "all"]],
  ["parapuan.co", ["page", "all"]],
  ["sonora.id", ["page", "all"]],
  ["herstory.co.id", ["page", "all"]],
  ["motorplus-online.com", ["page", "all"]],
  ["kompasiana.com", ["page", "all"]],
  ["idntimes.com", ["page", "all"]],
  ["popmama.com", ["page", "all"]],
  ["kosadata.com", ["page", "all"]],
  ["fajar.co.id", ["page", "all"]],
  ["sindonews.com", ["showpage", "all"]],
  ["poskota.co.id", ["view", "all"]],
  ["detik.com", ["single", "1"]],
  ["insidermonkey.com", ["singlepage", "1"]],
]);

const PATH_RULES = new Map([
  ["inews.id", "all"],
  ["wahananews.co", "0"],
]);

const SLASH_QUERY_RULES = new Map([
  ["jawapos.com", "page"],
  ["beritasatu.com", "view"],
]);

function matchesDomain(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function hasQueryKey(url, key) {
  return url.searchParams.has(key);
}

function withQuery(url, key, value = "all") {
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

  for (const [domain, [key, value]] of QUERY_RULES) {
    if (matchesDomain(hostname, domain)) {
      rewritten = withQuery(url, key, value);
      break;
    }
  }

  if (!rewritten) {
    for (const [domain, key] of SLASH_QUERY_RULES) {
      if (matchesDomain(hostname, domain)) {
        const path = url.pathname.replace(/\/+$/, "");
        if (hasQueryKey(url, key)) {
          return null;
        }
        url.pathname = `${path}/`;
        rewritten = withQuery(url, key);
        break;
      }
    }
  }

  if (!rewritten) {
    for (const [domain, suffix] of PATH_RULES) {
      if (matchesDomain(hostname, domain)) {
        rewritten = withPathSuffix(url, suffix);
        break;
      }
    }
  }

  return rewritten?.toString() ?? null;
}
