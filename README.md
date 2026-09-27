# Articleall

Articleall is a lightweight Manifest V3 Safari Web Extension that redirects
supported multi-page articles to their full-page view. Redirects happen only
for top-level web navigation, preserve unrelated query parameters and URL
fragments, and stop automatically when the target parameter or path is already
present.

## Install manually

1. Open this repository in Xcode on macOS.
2. Create or open a macOS App project with a **Safari Web Extension**
   target.
3. Set the target's extension source directory to this repository.
4. Build and run the containing app, then enable Articleall in Safari under
   **Safari > Settings > Extensions**.

Safari Web Extensions are distributed inside a containing app; Xcode performs
the final Safari extension packaging and signing.

The extension is enabled by default. Click the Articleall toolbar icon to pause
or resume automatic redirects. The setting is stored with Chrome Sync.

## Supported sites

| Site | Full-page rule |
| --- | --- |
| `kompas.com` and subdomains | `?page=all` |
| `suara.com` | `?page=all` |
| `tribunnews.com` | `?page=all` |
| `grid.id` | `?page=all` |
| `viva.co.id` | `?page=all` |
| `intipseleb.com` | `?page=all` |
| `parapuan.co` | `?page=all` |
| `sonora.id` | `?page=all` |
| `herstory.co.id` | `?page=all` |
| `motorplus-online.com` | `?page=all` |
| `kompasiana.com` | `?page=all` |
| `jawapos.com` | `/?page=all` |
| `idntimes.com` | `?page=all` |
| `popmama.com` | `?page=all` |
| `kosadata.com` | `?page=all` |
| `fajar.co.id` | `?page=all` |
| `sindonews.com` | `?showpage=all` |
| `poskota.co.id` | `?view=all` |
| `beritasatu.com` | `/?view=all` |
| `detik.com` | `?single=1` |
| `insidermonkey.com` | `?singlepage=1` |
| `inews.id` | path suffix `/all` |
| `wahananews.co` | path suffix `/0` |

## Development

The URL engine is a pure JavaScript module with focused tests:

```sh
npm test
```

No build step or external runtime dependency is required.
