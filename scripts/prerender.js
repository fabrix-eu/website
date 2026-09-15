/**
 * Emits a static HTML file per public route after the Vite build.
 *
 * The site is found through search engines and link previews (LinkedIn,
 * newsletters), neither of which runs the SPA. So at build time we read
 * Directus and, for every route, write a real HTML page: its own <title>,
 * description, canonical, Open Graph tags (with the cover image for news), and
 * the text inside #root. React replaces that markup on mount.
 *
 * Runs as part of `npm run build`. Needs no token: it reads published content
 * through the Public role, exactly as the browser does.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const DIRECTUS = (process.env.VITE_DIRECTUS_URL ?? "https://back.fabrixproject.eu").replace(/\/$/, "");
const SITE = (process.env.SITE_URL ?? "https://fabrixproject.eu").replace(/\/$/, "");
/*
 * BETA=true for a preview on another domain while fabrixproject.eu serves
 * something else: every page is noindex and robots.txt disallows all, so
 * search engines never index the preview as duplicate content. Canonicals
 * keep pointing at SITE_URL, the domain that stays.
 */
const BETA = process.env.BETA === "true";
const DEFAULT_DESCRIPTION =
  "Fostering local, beautiful, and sustainably designed regenerative textile and clothing ecosystems in Rotterdam, Athens and across Europe.";

// Each page writes its own description and og tags; strip the shell's once.
const shell = (await readFile(resolve(dist, "index.html"), "utf8"))
  .replace(/\n?\s*<meta\s+name="description"[\s\S]*?\/>/g, "")
  .replace(/\n?\s*<meta\s+property="og:[\s\S]*?\/>/g, "")
  .replace("</head>", BETA ? `  <meta name="robots" content="noindex, nofollow" />\n  </head>` : "</head>");

const escape = (value) =>
  String(value ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const text = (html) => String(html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const excerpt = (html, max = 180) => {
  const plain = text(html);
  return plain.length > max ? `${plain.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : plain;
};

async function fetchJson(path) {
  const res = await fetch(`${DIRECTUS}${path}`);
  if (!res.ok) throw new Error(`${path} → ${res.status}. Is the Public role allowed to read it?`);
  return (await res.json()).data;
}

function page({ title, description = DEFAULT_DESCRIPTION, path, body, image, type = "website" }) {
  const url = `${SITE}${path}`;
  const fullTitle = title ? `${title} · FABRIX Project` : "FABRIX Project";
  const head = [
    `<title>${escape(fullTitle)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escape(fullTitle)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="FABRIX Project" />`,
    image ? `<meta property="og:image" content="${DIRECTUS}/assets/${image}?width=1200&height=630&fit=cover&format=jpg" />` : "",
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
  ].filter(Boolean).join("\n    ");

  return shell
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

const routes = [];
const emit = async (path, options) => {
  const dir = resolve(dist, path.replace(/^\//, ""));
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, "index.html"), page({ path, ...options }));
  routes.push(path);
};

const [news, cities, legal, partners] = await Promise.all([
  fetchJson("/items/news?filter[status][_eq]=published&sort=-pinned,-date&limit=-1&fields=slug,title,date,cover,body,body_2"),
  fetchJson("/items/cities?sort=sort&limit=-1&fields=slug,name,intro,cover,about_title,about,stakeholders,contacts"),
  fetchJson("/items/legal_pages?limit=-1&fields=slug,title,body"),
  fetchJson("/items/partners?filter[on_website][_eq]=true&sort=sort&limit=-1&fields=key,name,blurb"),
]);

const newsList = `<h2>News</h2><ul>${news.map((n) => `<li><a href="/news/${n.slug}">${escape(n.title)}</a></li>`).join("")}</ul>`;

await emit("/", { title: "", body: `<h1>Fostering local, beautiful, and sustainably designed regenerative textile and clothing ecosystems</h1><p>in Rotterdam and Athens and across Europe.</p>${newsList}` });
await emit("/news", { title: "News", description: "News from the FABRIX project: events, open calls, publications and results.", body: `<h1>News</h1>${newsList}` });
await emit("/about", { title: "About", description: "FABRIX is a Horizon Europe project fostering regenerative textile and clothing ecosystems in Rotterdam and Athens.", body: "<h1>About Fabrix</h1>" });
await emit("/platform", { title: "Platform", description: "Digital tools to enhance local stakeholders’ capacity to manage and improve value chains.", body: "<h1>Platform</h1>" });
await emit("/contact", { title: "Contact", description: "Who to contact about the FABRIX project.", body: "<h1>Contact</h1>" });
await emit("/documentation", { title: "EU Documentation", description: "FABRIX scientific publications and public deliverables to the European Commission.", body: "<h1>EU Documentation</h1>" });
await emit("/partners", {
  title: "Partners",
  description: "The European consortium running the FABRIX project.",
  body: `<h1>Partners</h1>${partners.map((p) => `<h2>${escape(p.name)}</h2><p>${escape(p.blurb)}</p>`).join("")}`,
});

for (const n of news) {
  await emit(`/news/${n.slug}`, {
    title: n.title,
    description: excerpt(n.body) || DEFAULT_DESCRIPTION,
    image: n.cover,
    type: "article",
    body: `<article><h1>${escape(n.title)}</h1><time datetime="${n.date}">${n.date}</time>${n.body ?? ""}${n.body_2 ?? ""}</article>`,
  });
}

for (const c of cities) {
  await emit(`/cities/${c.slug}`, {
    title: c.name,
    description: c.intro ?? DEFAULT_DESCRIPTION,
    image: c.cover,
    body: `<h1>${escape(c.name)}</h1><p>${escape(c.intro)}</p><h2>${escape(c.about_title)}</h2>${marked.parse(c.about ?? "")}${marked.parse(c.stakeholders ?? "")}${marked.parse(c.contacts ?? "")}`,
  });
}

const LEGAL_PATHS = { "privacy-policy": "/privacy-policy", "cookies-policy": "/privacy-policy/cookies" };
for (const l of legal) {
  if (LEGAL_PATHS[l.slug]) await emit(LEGAL_PATHS[l.slug], { title: l.title, body: marked.parse(l.body ?? "") });
}

// GitHub Pages serves 404.html for anything unmatched; hand it the SPA shell so
// the router renders its own not-found page.
await writeFile(resolve(dist, "404.html"), shell.replace("<title>FABRIX Project</title>", "<title>Page not found · FABRIX Project</title>"));
await writeFile(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes.map((u) => `  <url><loc>${SITE}${u === "/" ? "/" : `${u}/`}</loc></url>`).join("\n") +
    `\n</urlset>\n`,
);
await writeFile(
  resolve(dist, "robots.txt"),
  BETA ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`,
);

console.log(`Prerendered ${routes.length} routes (${news.length} news, ${cities.length} cities), sitemap and robots.txt${BETA ? " — BETA: noindex" : ""}.`);
