# CLAUDE.md — FABRIX website

## What this is

The public website of the FABRIX project, `fabrixproject.eu`. It replaces the Next.js + DatoCMS site
(`~/Projects/fabrix/fabrix-website`, to be archived after the cutover) with the **same stack as the Learning
Hub** (`~/Projects/fabrix/learning-hub`): React 19 + Vite + TanStack Router/Query + Tailwind v4, prerendered
to static HTML, deployed on GitHub Pages.

- **Content**: Directus at `back.fabrixproject.eu` — the **same instance as the Learning Hub**, read through
  the Public role. No token in the bundle.
- **Design**: the old site's look, carried over unchanged (Archia + IBM Plex Sans, dark blue). The FABRIX
  design system tokens (`fx-*`, from `platform.fabrixproject.eu/design`) sit alongside in `src/index.css`; a
  move to the full system is a token swap. Do not re-pick token values here.

## Directus: what this repo owns

All website collections live under the **Website** folder in Directus, apart from the Learning Hub's:

| Collection | What | Public |
|---|---|---|
| `news` (+ `news_files`, `news_files_2`) | Articles: `body` + `gallery`, optional `body_2` + `gallery_2` | read, `status = published` |
| `cities` | Athens, Rotterdam — text fields are **Markdown** | read |
| `deliverables`, `publications` | `/documentation` | read |
| `legal_pages` | `privacy-policy`, `cookies-policy` — Markdown | read |
| `newsletter_subscriptions` | Sign-ups from the home page | **create only** |

**`partners` is shared with the Learning Hub.** The hub owns `name`, `short`, `blurb`, `country`…; this repo
added `url`, `on_website`, `logo_mono`, `sort`. The website lists `on_website = true` ordered by `sort`. Never
rename or drop a hub field from here.

Scripts (all idempotent, token in `.env`):

```
npm run directus:bootstrap     # model, additive only
npm run directus:permissions   # Public role grants
npm run directus:migrate       # ONE-SHOT import from the old site + DatoCMS — overwrites editor changes, do not re-run
```

## Conventions

Follow `/dev-fullstack-ruby-react` (front half) and the Learning Hub; the deltas:

- `src/features/<name>/` holds queries (`queryOptions`) and components; `src/routes/` holds thin static pages;
  `src/lib/router.tsx` wires loaders (`ensureQueryData`) and throws `notFound()` for unknown slugs.
- **Route paths stay literal in `createRoute`** — a helper taking `path: string` erases them from the router's
  types and every `<Link to>` to that route stops compiling.
- Rich text: news bodies are HTML → `<RichHtml>` (DOMPurify, https iframes allowed, internal links through the
  router). Cities and legal pages are Markdown → `<Markdown>`.
- Images always go through `assetUrl(id, { width, … })` (Directus transforms, webp). Never the raw asset.
- Forms: uncontrolled + `FormData`; Directus is the validation authority, its errors render next to the field.
- Files < 200 lines (`eslint max-lines`). Gates: `npm run typecheck && npm run lint && npm run build`.

## Publishing

Prerendering means published content must be **built** to be visible — saving in Directus alone changes
nothing on the site. Editors press **"Build & deploy — website"** in the header of any website collection
(`news`, `cities`, `deliverables`, `publications`, `legal_pages`, `partners`). That manual flow
(`npm run directus:flow`, idempotent) POSTs a `repository_dispatch` of type `content-updated` to this repo,
which runs the CI & Deploy workflow. It reuses the Learning Hub's `GITHUB_DISPATCH_TOKEN` from the container
env (`FLOWS_ENV_ALLOW_LIST` in `rdmpr-infra/apps/fabrix-cms`). Failure mode to watch: if the flow breaks,
Directus says "published" while the site stays frozen — check the Actions tab.

**Beta**: the site is previewed at `https://website.fabrixproject.eu` (GitHub Pages, `public/CNAME`, CNAME
record at OVH → `fabrix-eu.github.io.`, Directus `CORS_ORIGIN` includes it). `BETA=true` in the workflow
makes every page `noindex` and `robots.txt` disallow all; canonicals already point at `fabrixproject.eu`.
Cutover: set `BETA` to `false`, move `public/CNAME` and the Pages domain to `fabrixproject.eu`, repoint the
apex/`www` records from Vercel to GitHub Pages, and add the origin to `CORS_ORIGIN`.
