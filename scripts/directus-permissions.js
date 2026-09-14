/**
 * Opens public read access to the website's published content.
 *
 * `partners` and `directus_files` are already public — the Learning Hub's
 * permissions script grants them — so they are only checked here, not granted.
 *
 *   npm run directus:permissions
 */
import { api, ensure } from "./directus.js";

const READABLE = {
  news: { status: { _eq: "published" } },
  news_files: { news_id: { status: { _eq: "published" } } },
  news_files_2: { news_id: { status: { _eq: "published" } } },
  cities: {},
  deliverables: {},
  publications: {},
  legal_pages: {},
};

const policies = await api("GET", "/policies?limit=100&fields=id,name");
const policy = policies.find((p) => p.name === "$t:public_label")?.id ?? policies.find((p) => p.name?.toLowerCase().includes("public"))?.id;
if (!policy) throw new Error("No public policy found on this Directus.");
console.log(`→ using policy ${policy}`);

// `directus_permissions` has no unique constraint on (policy, collection, action):
// a re-run would add a duplicate rule rather than fail, hence the explicit check.
const existing = await api("GET", `/permissions?limit=-1&fields=id,collection,action,policy&filter[policy][_eq]=${policy}`);
const has = (collection, action) => existing.some((p) => p.collection === collection && p.action === action);

for (const [collection, permissions] of Object.entries(READABLE)) {
  if (has(collection, "read")) console.log(`  · read ${collection} (exists)`);
  else await ensure(`read ${collection}`, () => api("POST", "/permissions", { policy, collection, action: "read", fields: ["*"], permissions, validation: {} }));
}

for (const collection of ["partners", "directus_files"]) {
  console.log(has(collection, "read") ? `  · read ${collection} (granted by the Learning Hub)` : `  ! read ${collection} is missing — run the Learning Hub's directus:permissions`);
}
