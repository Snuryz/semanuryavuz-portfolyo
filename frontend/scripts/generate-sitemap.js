/**
 * Derlemeden önce public/sitemap.xml ve public/robots.txt dosyalarını üretir.
 * Projeler ve blog yazıları backend API'sinden okunur; API'ye ulaşılamazsa
 * yalnızca sabit sayfalarla devam eder (derleme asla bu yüzden durmaz).
 */
const fs = require("fs");
const path = require("path");

// .env dosyasını oku (react-scripts bu betikten önce çalışmadığı için)
for (const file of [".env", ".env.production", ".env.production.local", ".env.local"]) {
  const full = path.join(__dirname, "..", file);
  if (!fs.existsSync(full)) continue;
  for (const line of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

const SITE = (process.env.REACT_APP_SITE_URL || "").replace(/\/$/, "");
const API = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
const PUBLIC = path.join(__dirname, "..", "public");

const fetchJson = async (url) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
};

const day = (iso) => (iso ? iso.slice(0, 10) : undefined);

(async () => {
  if (!SITE) {
    console.warn("[sitemap] REACT_APP_SITE_URL tanımlı değil, atlanıyor.");
    return;
  }

  const urls = [
    { loc: "/", priority: "1.0" },
    { loc: "/projects", priority: "0.8" },
    { loc: "/blog", priority: "0.8" },
  ];

  if (API) {
    try {
      const [projects, posts, categories] = await Promise.all([
        fetchJson(`${API}/projects/`),
        fetchJson(`${API}/posts/`),
        fetchJson(`${API}/categories/`),
      ]);
      projects.forEach((p) => urls.push({ loc: `/projects/${p.slug}`, priority: "0.7" }));
      categories
        .filter((c) => c.post_count > 0)
        .forEach((c) => urls.push({ loc: `/blog/kategori/${c.slug}`, priority: "0.6" }));
      posts.forEach((p) =>
        urls.push({ loc: `/blog/${p.slug}`, priority: "0.6", lastmod: day(p.published_at) })
      );
      console.log(`[sitemap] ${projects.length} proje, ${posts.length} yazı, ${categories.length} kategori okundu.`);
    } catch (err) {
      console.warn(`[sitemap] API'ye ulaşılamadı (${err.message}); yalnızca ana sayfalar yazıldı.`);
    }
  }

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${SITE}${u.loc}</loc>\n` +
        (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : "") +
        `    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");

  fs.writeFileSync(
    path.join(PUBLIC, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
  fs.writeFileSync(
    path.join(PUBLIC, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
  );
  console.log(`[sitemap] ${urls.length} adres yazıldı → public/sitemap.xml`);
})();
