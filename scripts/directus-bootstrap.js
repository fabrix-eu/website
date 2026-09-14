/**
 * Adds the website's content model to the FABRIX Directus (back.fabrixproject.eu),
 * the instance the Learning Hub already runs on.
 *
 * Additive only: it creates the website collections under a "Website" folder and
 * adds fields to the shared `partners` collection. It never alters or drops what
 * the Learning Hub bootstrap created. Re-running is safe.
 *
 *   npm run directus:bootstrap
 */
import { api, ensure } from "./directus.js";

const WYSIWYG_TOOLBAR = [
  "bold", "italic", "underline", "h2", "h3", "h4", "numlist", "bullist",
  "removeformat", "blockquote", "table", "customLink", "customImage", "customMedia",
  "hr", "code", "fullscreen",
];

const status = {
  field: "status", type: "string",
  meta: {
    interface: "select-dropdown", width: "half", required: true,
    options: { choices: [
      { text: "Draft", value: "draft" }, { text: "Published", value: "published" }, { text: "Archived", value: "archived" },
    ] },
  },
  schema: { default_value: "draft" },
};
const sort = { field: "sort", type: "integer", meta: { interface: "input", hidden: true } };
const markdown = (field, note) => ({ field, type: "text", meta: { interface: "input-rich-text-md", note } });
const image = (field, note) => ({ field, type: "uuid", meta: { interface: "file-image", special: ["file"], width: "half", note }, file: true });

/** Groups the website collections in the Directus sidebar, apart from the Learning Hub's. */
const GROUP = "website";

const COLLECTIONS = [
  {
    collection: "news",
    meta: { icon: "newspaper", note: "News articles on fabrixproject.eu.", archive_field: "status", archive_value: "archived", sort_field: null },
    fields: [
      { field: "id", type: "uuid", meta: { hidden: true, special: ["uuid"] }, schema: { is_primary_key: true } },
      status,
      { field: "pinned", type: "boolean", meta: { interface: "boolean", width: "half", note: "Pinned articles come first on the home page and /news." }, schema: { default_value: false } },
      { field: "title", type: "string", meta: { interface: "input", required: true } },
      { field: "slug", type: "string", meta: { interface: "input", required: true, note: "Public URL. Never change it after publishing." }, schema: { is_unique: true } },
      { field: "date", type: "date", meta: { interface: "datetime", required: true, width: "half" } },
      image("cover", "Card and article header."),
      { field: "body", type: "text", meta: { interface: "input-rich-text-html", options: { toolbar: WYSIWYG_TOOLBAR } } },
      { field: "body_2", type: "text", meta: { interface: "input-rich-text-html", note: "Optional second section, shown after the first gallery.", options: { toolbar: WYSIWYG_TOOLBAR } } },
      { field: "date_updated", type: "timestamp", meta: { interface: "datetime", special: ["date-updated"], readonly: true, width: "half", hidden: true } },
    ],
  },
  {
    collection: "cities",
    meta: { icon: "location_city", note: "The two FABRIX case-study cities.", sort_field: "sort" },
    fields: [
      { field: "slug", type: "string", meta: { interface: "input", required: true, width: "half", note: "Public URL: /cities/<slug>." }, schema: { is_primary_key: true } },
      { field: "name", type: "string", meta: { interface: "input", required: true, width: "half" } },
      { field: "intro", type: "text", meta: { interface: "input-multiline" } },
      image("cover"),
      image("background", "Full-width band between 'About' and 'Stakeholders'."),
      { field: "about_title", type: "string", meta: { interface: "input" } },
      markdown("about"),
      markdown("stakeholders"),
      markdown("contact_intro", "Shown above the contact card."),
      markdown("contacts", "The contact card: one paragraph per contact."),
      sort,
    ],
  },
  {
    collection: "deliverables",
    meta: { icon: "description", note: "Public deliverables to the European Commission (/documentation).", sort_field: "sort" },
    fields: [
      { field: "id", type: "integer", meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      { field: "code", type: "string", meta: { interface: "input", required: true, width: "half", note: "e.g. D6.1" }, schema: { is_unique: true } },
      { field: "approval", type: "string", meta: { interface: "select-dropdown", width: "half", options: { choices: [
        { text: "Awaiting final approval", value: "awaiting final approval" }, { text: "Approved", value: "approved" },
      ] } } },
      { field: "title", type: "string", meta: { interface: "input", required: true } },
      { field: "description", type: "text", meta: { interface: "input-multiline" } },
      { field: "file", type: "uuid", meta: { interface: "file", special: ["file"], width: "half", note: "Upload the PDF here…" }, file: true },
      { field: "url", type: "string", meta: { interface: "input", width: "half", note: "…or link to where it is hosted." } },
      sort,
    ],
  },
  {
    collection: "publications",
    meta: { icon: "school", note: "Scientific publications (/documentation).", sort_field: "sort" },
    fields: [
      { field: "id", type: "integer", meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      { field: "citation", type: "text", meta: { interface: "input-multiline", required: true, note: "Full reference, as it should read." } },
      { field: "link_label", type: "string", meta: { interface: "input", width: "half", note: "e.g. Read on Zenodo" } },
      { field: "url", type: "string", meta: { interface: "input", width: "half", required: true } },
      sort,
    ],
  },
  {
    collection: "newsletter_subscriptions",
    meta: { icon: "mail", note: "Newsletter sign-ups from the website. Public create, admin read. A flow forwards each one to Brevo." },
    fields: [
      { field: "id", type: "integer", meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
      {
        field: "email", type: "string",
        meta: {
          interface: "input", required: true, width: "half",
          validation: { _and: [{ email: { _regex: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$" } }] },
          validation_message: "A valid email address is required.",
        },
      },
      { field: "first_name", type: "string", meta: { interface: "input", required: true, width: "half" } },
      { field: "last_name", type: "string", meta: { interface: "input", required: true, width: "half" } },
      { field: "synced", type: "boolean", meta: { interface: "boolean", width: "half", readonly: true, note: "Set by the Brevo flow once the contact is created." }, schema: { default_value: false } },
      { field: "date_created", type: "timestamp", meta: { interface: "datetime", special: ["date-created"], readonly: true, width: "half" } },
    ],
  },
  {
    collection: "legal_pages",
    meta: { icon: "gavel", note: "Privacy and cookies policies." },
    fields: [
      { field: "slug", type: "string", meta: { interface: "input", required: true, width: "half" }, schema: { is_primary_key: true } },
      { field: "title", type: "string", meta: { interface: "input", required: true, width: "half" } },
      markdown("body"),
      { field: "date_updated", type: "timestamp", meta: { interface: "datetime", special: ["date-updated"], readonly: true, width: "half" } },
    ],
  },
];

/** Fields the website needs on the Learning Hub's `partners`. */
const PARTNER_FIELDS = [
  { field: "url", type: "string", meta: { interface: "input", width: "half", note: "The partner's own website." } },
  { field: "on_website", type: "boolean", meta: { interface: "boolean", width: "half", note: "Listed among the consortium on fabrixproject.eu." }, schema: { default_value: false } },
  image("logo_mono", "Single-colour variant, used on the home page strip. Falls back to the logo."),
  sort,
];

/** Gallery junctions: files m2m, ordered. One per section of a news article. */
const GALLERIES = [
  { name: "news_files", field: "gallery", note: "Photos shown after the body." },
  { name: "news_files_2", field: "gallery_2", note: "Photos shown after the second section." },
];

async function addField(collection, { file, ...field }) {
  await ensure(`${collection}.${field.field}`, () => api("POST", `/fields/${collection}`, field));
  if (file) {
    await ensure(`${collection}.${field.field} → directus_files`, () =>
      api("POST", "/relations", { collection, field: field.field, related_collection: "directus_files", schema: { on_delete: "SET NULL" } }),
    );
  }
}

console.log("→ folder");
await ensure(GROUP, () => api("POST", "/collections", { collection: GROUP, meta: { icon: "public", note: "Content of fabrixproject.eu.", collapse: "open" }, schema: null }));

console.log("→ collections");
for (const { collection, meta, fields } of COLLECTIONS) {
  await ensure(collection, () => api("POST", "/collections", { collection, meta: { ...meta, group: GROUP }, schema: {}, fields: fields.slice(0, 1) }));
  for (const field of fields.slice(1)) await addField(collection, field);
}

console.log("→ partners (shared with the Learning Hub)");
for (const field of PARTNER_FIELDS) await addField("partners", field);
await ensure("partners.logo → directus_files", () =>
  api("POST", "/relations", { collection: "partners", field: "logo", related_collection: "directus_files", schema: { on_delete: "SET NULL" } }),
);

console.log("→ galleries");
for (const g of GALLERIES) {
  await ensure(g.name, async () => {
    await api("POST", "/collections", {
      collection: g.name,
      meta: { hidden: true, icon: "import_export", group: GROUP },
      schema: {},
      fields: [{ field: "id", type: "integer", meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } }],
    });
    // Both relations need `junction_field` pointing at the opposite column, or the
    // m2m interface reports "The relationship is not configured properly".
    for (const side of [
      { field: "news_id", type: "uuid", related: "news", other: "directus_files_id" },
      { field: "directus_files_id", type: "uuid", related: "directus_files", other: "news_id" },
    ]) {
      await api("POST", `/fields/${g.name}`, { field: side.field, type: side.type, meta: { hidden: true }, schema: {} });
      await api("POST", "/relations", {
        collection: g.name, field: side.field, related_collection: side.related,
        meta: { junction_field: side.other }, schema: { on_delete: "CASCADE" },
      });
    }
    await api("POST", `/fields/${g.name}`, { field: "sort", type: "integer", meta: { interface: "input", hidden: true }, schema: {} });
    await api("POST", "/fields/news", { field: g.field, type: "alias", meta: { interface: "files", special: ["files"], note: g.note } });
    return api("PATCH", `/relations/${g.name}/news_id`, { meta: { one_field: g.field, junction_field: "directus_files_id", sort_field: "sort" } });
  });
}

console.log("→ display templates");
const DISPLAY = { news: "{{title}}", cities: "{{name}}", deliverables: "{{code}} · {{title}}", publications: "{{citation}}", legal_pages: "{{title}}", newsletter_subscriptions: "{{email}}" };
for (const [collection, template] of Object.entries(DISPLAY)) {
  await ensure(`${collection} → ${template}`, () => api("PATCH", `/collections/${collection}`, { meta: { display_template: template } }));
}

console.log("\nDone. Next: npm run directus:permissions && npm run directus:migrate");
