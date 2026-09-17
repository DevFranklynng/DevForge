/**
 * Keeps the canonical / OG / Twitter / JSON-LD URLs pinned to whatever origin
 * actually serves the app (Vercel, Netlify, or localhost) instead of a stale
 * hardcoded domain. Runs on every route change.
 */
export function syncSeoUrls() {
  const { origin, pathname } = window.location;
  const url = origin + pathname;

  document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", url);

  for (const sel of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const el = document.querySelector(sel);
    if (el) el.setAttribute("content", `${origin}/og.svg`);
  }

  const ld = document.getElementById("app-jsonld");
  if (ld) {
    try {
      const data = JSON.parse(ld.textContent || "{}");
      if (data.url) data.url = url;
      ld.textContent = JSON.stringify(data);
    } catch {
      /* keep the static markup on parse failure */
    }
  }
}