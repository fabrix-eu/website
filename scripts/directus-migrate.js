/**
 * One-shot migration of the old Next.js site into Directus:
 *   - content/*.json (exported from the old app/lib/data) → partners, cities, deliverables, publications, legal_pages
 *   - DatoCMS posts → news, with every image and linked file re-hosted in Directus
 *
 * Idempotent on natural keys (slug, code, url, filename), so it can be re-run
 * until the result is right. It overwrites edits made in Directus to the rows it
 * owns — once editors start working in Directus, do not run it again.
 *
 *   npm run directus:migrate
 *
 * While DatoCMS is still the old site's CMS, an article edited there can be
 * re-imported on its own — everything else is left untouched:
 *
 *   npm run directus:migrate -- --news=rotterdam-conference[,other-slug]
 */
import { readFile } from "node:fs/promises";
import { basename, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { api, directusToken, directusUrl } from "./directus.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const json = async (name) => JSON.parse(await readFile(resolve(root, "content", `${name}.json`), "utf8"));

/** Source text was wrapped for the editor; publications and deliverables are plain paragraphs. */
const oneLine = (s) => s?.replace(/\s*\n\s*/g, " ").trim() ?? null;

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

// ── Directus helpers ────────────────────────────────────────────────────────

async function folder(name, parent = null) {
  const filter = `filter[name][_eq]=${encodeURIComponent(name)}&filter[parent][${parent ? "_eq" : "_null"}]=${parent ?? "true"}`;
  const found = await api("GET", `/folders?${filter}&limit=1`);
  return found?.[0]?.id ?? (await api("POST", "/folders", { name, parent })).id;
}

async function findFile(filename, folderId) {
  const found = await api("GET", `/files?filter[filename_download][_eq]=${encodeURIComponent(filename)}&filter[folder][_eq]=${folderId}&fields=id&limit=1`);
  return found?.[0]?.id ?? null;
}

async function uploadLocal(path, folderId, title) {
  const name = basename(path);
  const existing = await findFile(name, folderId);
  if (existing) return existing;
  const form = new FormData();
  form.append("folder", folderId); // metadata must precede the file part
  form.append("title", title);
  form.append("file", new Blob([await readFile(path)], { type: MIME[extname(name).toLowerCase()] ?? "application/octet-stream" }), name);
  const res = await fetch(`${directusUrl}/files`, { method: "POST", headers: { Authorization: `Bearer ${directusToken}` }, body: form });
  if (!res.ok) throw new Error(`upload ${name} → ${res.status} ${await res.text()}`);
  return (await res.json()).data.id;
}

/** Re-hosts a remote file; the DatoCMS filename (timestamp-prefixed, hence unique) is the dedup key. */
async function importRemote(url, folderId, title) {
  const clean = url.split("?")[0];
  const name = decodeURIComponent(basename(clean));
  const existing = await findFile(name, folderId);
  if (existing) return existing;
  const file = await api("POST", "/files/import", { url: clean, data: { folder: folderId, title: title || name.replace(/^\d+-/, "").replace(extname(name), "") } });
  return file.id;
}

async function upsert(collection, key, value, payload) {
  const existing = await api("GET", `/items/${collection}?filter[${key}][_eq]=${encodeURIComponent(value)}&limit=1`);
  if (existing?.length) {
    const id = existing[0].id ?? existing[0][key];
    await api("PATCH", `/items/${collection}/${encodeURIComponent(id)}`, payload);
    return id;
  }
  const created = await api("POST", `/items/${collection}`, { [key]: value, ...payload });
  return created.id ?? created[key];
}

const website = await folder("Website");
const folders = {
  partners: await folder("Partners", website),
  cities: await folder("Cities", website),
  news: await folder("News", website),
};

/** `--news=a,b` re-imports only those DatoCMS articles and skips every other section. */
const ONLY_NEWS = process.argv.find((arg) => arg.startsWith("--news="))?.slice("--news=".length).split(",").filter(Boolean);

if (!ONLY_NEWS) {

// ── Partners (shared with the Learning Hub) ─────────────────────────────────

console.log("→ partners");
/** The old site's slugs, where they differ from the keys the Learning Hub already uses. */
const PARTNER_KEYS = { rotterdam: "rdam", tud: "TUD" };
const known = new Set((await api("GET", "/items/partners?fields=key&limit=-1")).map((p) => p.key));

for (const [index, partner] of (await json("partners")).entries()) {
  const key = PARTNER_KEYS[partner.slug] ?? partner.slug;
  const asset = (file) => resolve(root, "content/assets", file.replace(/^\//, ""));
  const payload = {
    url: partner.url,
    on_website: true,
    sort: index,
    // The website's logos are the better files: they replace whatever is set.
    logo: await uploadLocal(asset(partner.logo), folders.partners, partner.name),
    logo_mono: partner.logo_b ? await uploadLocal(asset(partner.logo_b), folders.partners, `${partner.name} (mono)`) : null,
  };
  if (known.has(key)) {
    // Name and blurb are curated on the Learning Hub side — left untouched.
    await api("PATCH", `/items/partners/${encodeURIComponent(key)}`, payload);
    console.log(`  ✓ ${key}`);
  } else {
    await api("POST", "/items/partners", { key, name: partner.name, short: partner.name, blurb: partner.description, ...payload });
    console.log(`  + ${key} (new)`);
  }
}

// ── Cities ──────────────────────────────────────────────────────────────────

console.log("→ cities");
for (const [index, city] of (await json("cities")).entries()) {
  const asset = (file) => uploadLocal(resolve(root, "content/assets", file.replace(/^\//, "")), folders.cities, city.name);
  await upsert("cities", "slug", city.slug, {
    name: city.name,
    intro: city.introText,
    cover: await asset(city.coverImage),
    background: await asset(city.backgroundImage),
    about_title: city.aboutTitle,
    about: city.aboutText,
    stakeholders: city.stakeholdersText,
    contact_intro: city.contactText,
    contacts: city.contactInfo,
    sort: index,
  });
  console.log(`  ✓ ${city.slug}`);
}

// ── Documentation ───────────────────────────────────────────────────────────

console.log("→ deliverables");
for (const [index, d] of (await json("deliverables")).entries()) {
  await upsert("deliverables", "code", d.code, {
    title: d.title, description: oneLine(d.description), approval: d.status ?? null, url: d.link ?? null, sort: index,
  });
  console.log(`  ✓ ${d.code}`);
}

console.log("→ publications");
for (const [index, p] of (await json("publications")).entries()) {
  await upsert("publications", "url", p.link, { citation: oneLine(p.description), link_label: p.linkTitle, sort: index });
  console.log(`  ✓ ${p.link}`);
}

console.log("→ legal pages");
const LEGAL_TITLES = { "privacy-policy": "Privacy policy", "cookies-policy": "Cookies policy" };
for (const page of await json("legal")) {
  await upsert("legal_pages", "slug", page.slug, { title: LEGAL_TITLES[page.slug], body: page.body });
  console.log(`  ✓ ${page.slug}`);
}

} // end of the sections skipped by --news

// ── News, from DatoCMS ──────────────────────────────────────────────────────

console.log(ONLY_NEWS ? `→ news (DatoCMS): ${ONLY_NEWS.join(", ")} only` : "→ news (DatoCMS)");
if (!process.env.DATOCMS_TOKEN) throw new Error("DATOCMS_TOKEN is not set.");

const image = "url alt title";
const res = await fetch("https://graphql.datocms.com/", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.DATOCMS_TOKEN}`,
    "X-Environment": process.env.DATOCMS_ENVIRONMENT ?? "main",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: `{ allPosts(first: 100, orderBy: date_DESC) { title slug date pinned coverImage { ${image} } content1 gallery1 { ${image} } content2 gallery2 { ${image} } } }` }),
});
const { data, errors } = await res.json();
if (errors) throw new Error(`DatoCMS: ${JSON.stringify(errors)}`);

const DATO_ASSET = /https:\/\/www\.datocms-assets\.com\/[^\s"'<>)]+/g;

/** Images and linked files (PDF, .docx, .ics) inside the HTML move to Directus too. */
async function rehost(html, slug) {
  if (!html) return null;
  let out = html;
  for (const url of new Set(html.match(DATO_ASSET) ?? [])) {
    const id = await importRemote(url, folders.news, null);
    out = out.replaceAll(url, `${directusUrl}/assets/${id}`);
  }
  if (out.includes('href="/open-call-greek-version"')) console.warn(`  ! ${slug}: links to /open-call-greek-version, which is retired`);
  return out;
}

async function setGallery(junction, newsId, images) {
  const rows = await api("GET", `/items/${junction}?filter[news_id][_eq]=${newsId}&fields=id&limit=-1`);
  if (rows.length) await api("DELETE", `/items/${junction}`, rows.map((r) => r.id));
  for (const [sort, img] of (images ?? []).entries()) {
    const fileId = await importRemote(img.url, folders.news, img.alt || img.title);
    await api("POST", `/items/${junction}`, { news_id: newsId, directus_files_id: fileId, sort });
  }
}

const posts = ONLY_NEWS ? data.allPosts.filter((post) => ONLY_NEWS.includes(post.slug)) : data.allPosts;
const missing = (ONLY_NEWS ?? []).filter((slug) => !posts.some((post) => post.slug === slug));
if (missing.length) throw new Error(`Not found in DatoCMS: ${missing.join(", ")}`);

for (const post of posts) {
  const id = await upsert("news", "slug", post.slug, {
    status: "published",
    title: post.title,
    date: post.date,
    pinned: post.pinned ?? false,
    cover: post.coverImage ? await importRemote(post.coverImage.url, folders.news, post.coverImage.alt || post.title) : null,
    body: await rehost(post.content1, post.slug),
    body_2: await rehost(post.content2, post.slug),
  });
  await setGallery("news_files", id, post.gallery1);
  await setGallery("news_files_2", id, post.gallery2);
  console.log(`  ✓ ${post.slug}`);
}

console.log(`\n${posts.length} news migrated into ${directusUrl}.`);
