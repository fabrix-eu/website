/**
 * The website's "Build & deploy" button in Directus.
 *
 * A manual flow on the website collections: an editor finishes a change, then
 * presses the button in the collection header. Its single operation POSTs a
 * `repository_dispatch` (`content-updated`) to fabrix-eu/website, which runs
 * the CI & Deploy workflow — the site is prerendered, so published content is
 * only visible after a build.
 *
 * Same shape as the Learning Hub's flow, and the same GitHub token: it is read
 * from the container env as {{$env.GITHUB_DISPATCH_TOKEN}}, which requires
 * FLOWS_ENV_ALLOW_LIST=GITHUB_DISPATCH_TOKEN (rdmpr-infra/apps/fabrix-cms).
 *
 * Idempotent: finds the flow by name and updates it in place.
 *
 *   npm run directus:flow
 */
import { api } from "./directus.js";

const NAME = "Build & deploy — website";

const FLOW = {
  name: NAME,
  icon: "rocket_launch",
  color: "#141357",
  description: "Publie les changements sur le site FABRIX (déclenche le build GitHub Pages de fabrix-eu/website).",
  status: "active",
  trigger: "manual",
  accountability: "all",
  options: {
    // `partners` is shared with the Learning Hub; its logos and links show on the website too.
    collections: ["news", "cities", "deliverables", "publications", "legal_pages", "partners"],
    requireSelection: false,
    requireConfirmation: true,
    confirmationDescription:
      "Publier les changements sur le site FABRIX ? Le site est reconstruit et sera à jour dans environ deux minutes.",
  },
};

const OPERATION = {
  name: "GitHub repository_dispatch",
  key: "github_dispatch",
  type: "request",
  position_x: 19,
  position_y: 1,
  options: {
    method: "POST",
    url: "https://api.github.com/repos/fabrix-eu/website/dispatches",
    headers: [
      { header: "Accept", value: "application/vnd.github+json" },
      { header: "Authorization", value: "Bearer {{$env.GITHUB_DISPATCH_TOKEN}}" },
      { header: "X-GitHub-Api-Version", value: "2022-11-28" },
      { header: "User-Agent", value: "directus-fabrix-cms" },
    ],
    body: JSON.stringify({ event_type: "content-updated" }),
  },
};

const existing = (await api("GET", `/flows?filter[name][_eq]=${encodeURIComponent(NAME)}&fields=id,operation&limit=1`))?.[0];

let flowId = existing?.id;
if (flowId) {
  await api("PATCH", `/flows/${flowId}`, FLOW);
  console.log(`  · flow ${flowId} updated`);
} else {
  flowId = (await api("POST", "/flows", FLOW)).id;
  console.log(`  + flow ${flowId} created`);
}

let operationId = existing?.operation;
if (operationId) {
  await api("PATCH", `/operations/${operationId}`, OPERATION);
  console.log(`  · operation ${operationId} updated`);
} else {
  operationId = (await api("POST", "/operations", { ...OPERATION, flow: flowId })).id;
  await api("PATCH", `/flows/${flowId}`, { operation: operationId });
  console.log(`  + operation ${operationId} created and wired`);
}

console.log(`\nDone. The button shows in the header of: ${FLOW.options.collections.join(", ")}.`);
console.log(`Flow id: ${flowId}`);
