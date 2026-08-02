/**
 * Lightweight SEO helpers (canonical host sync + optional analytics hook).
 * Replace SITE_ORIGIN when your live domain differs.
 */
(() => {
  const SITE_ORIGIN = "https://eventjunctionz.com";

  // Ensure absolute canonical matches production host when deployed there
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && location.hostname.includes("eventjunctionz")) {
    const path = location.pathname.endsWith("/") && location.pathname !== "/"
      ? location.pathname.slice(0, -1)
      : location.pathname;
    const file = path === "/" || path === "" ? "/" : path.split("/").pop() || "/";
    const href = file === "/" || file === "index.html"
      ? `${SITE_ORIGIN}/`
      : `${SITE_ORIGIN}/${file}`;
    canonical.setAttribute("href", href);
  }
})();
