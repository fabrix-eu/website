/**
 * Forwards each newsletter sign-up from Directus to Brevo.
 *
 * The website writes to `newsletter_subscriptions` (Public: create only). This
 * flow fires on every creation, POSTs the contact to Brevo and, when Brevo
 * accepts it, flips the row's `synced` to true. A row left at `synced = false`
 * is a sign-up that did not reach Brevo — filter on it in Directus.
 *
 * The Brevo key never leaves the server: it is read from the container env as
 * {{$env.BREVO_API_KEY}}, which requires BREVO_API_KEY in
 * FLOWS_ENV_ALLOW_LIST (rdmpr-infra/apps/fabrix-cms/docker-compose.yml).
 *
 * Idempotent: finds the flow by name and rebuilds its two operations.
 *
 *   BREVO_LIST_ID=3 npm run directus:newsletter-flow
 */
import { api } from "./directus.js";

const NAME = "Newsletter → Brevo";
const LIST_ID = Number(process.env.BREVO_LIST_ID ?? 3);

const FLOW = {
  name: NAME,
  icon: "forward_to_inbox",
  color: "#141357",
  description: `Envoie chaque inscription newsletter du site à Brevo (liste ${LIST_ID}), puis marque la ligne synced.`,
  status: "active",
  trigger: "event",
  accountability: "all",
  options: {
    type: "action", // non-blocking: the visitor's sign-up is saved even if Brevo is down
    scope: ["items.create"],
    collections: ["newsletter_subscriptions"],
  },
};

const BREVO = {
  name: "Create contact in Brevo",
  key: "brevo_contact",
  type: "request",
  position_x: 19,
  position_y: 1,
  options: {
    method: "POST",
    url: "https://api.brevo.com/v3/contacts",
    headers: [
      { header: "accept", value: "application/json" },
      { header: "content-type", value: "application/json" },
      { header: "api-key", value: "{{$env.BREVO_API_KEY}}" },
    ],
    // updateEnabled: a re-subscription updates the existing contact instead of failing.
    body: JSON.stringify({
      email: "{{$trigger.payload.email}}",
      attributes: { FIRSTNAME: "{{$trigger.payload.first_name}}", LASTNAME: "{{$trigger.payload.last_name}}" },
      listIds: [LIST_ID],
      updateEnabled: true,
    }),
  },
};

const MARK_SYNCED = {
  name: "Mark synced",
  key: "mark_synced",
  type: "item-update",
  position_x: 37,
  position_y: 1,
  options: {
    collection: "newsletter_subscriptions",
    key: ["{{$trigger.key}}"],
    payload: { synced: true },
    permissions: "$full",
    emitEvents: false, // never re-trigger flows from this write
  },
};

const existing = (await api("GET", `/flows?filter[name][_eq]=${encodeURIComponent(NAME)}&fields=id&limit=1`))?.[0];

let flowId = existing?.id;
if (flowId) {
  await api("PATCH", `/flows/${flowId}`, { ...FLOW, operation: null });
  const old = await api("GET", `/operations?filter[flow][_eq]=${flowId}&fields=id&limit=-1`);
  if (old.length) await api("DELETE", "/operations", old.map((o) => o.id));
  console.log(`  · flow ${flowId} updated, ${old.length} old operation(s) removed`);
} else {
  flowId = (await api("POST", "/flows", FLOW)).id;
  console.log(`  + flow ${flowId} created`);
}

// Created last-first so the Brevo step can point its `resolve` at "Mark synced".
const markId = (await api("POST", "/operations", { ...MARK_SYNCED, flow: flowId })).id;
const brevoId = (await api("POST", "/operations", { ...BREVO, flow: flowId, resolve: markId })).id;
await api("PATCH", `/flows/${flowId}`, { operation: brevoId });
console.log(`  + operations wired: Brevo (${brevoId}) → on success → Mark synced (${markId})`);

console.log(`\nDone. Every new newsletter_subscriptions row is sent to Brevo list ${LIST_ID}.`);
console.log(`Flow id: ${flowId}`);
