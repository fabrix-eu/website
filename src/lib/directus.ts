import { createDirectus, readItems, rest } from '@directus/sdk';

/*
 * In dev the browser calls `/cms` on its own origin and the vite proxy
 * forwards to VITE_DIRECTUS_URL, so no CORS rule applies. The build and the
 * prerender use the absolute URL.
 *
 * No token: the Directus Public role reads published content. Nothing secret
 * ships in this bundle.
 */
const CONFIGURED = import.meta.env.VITE_DIRECTUS_URL;

export const DIRECTUS_URL: string = import.meta.env.DEV
  ? `${window.location.origin}/cms`
  : CONFIGURED || 'https://back.fabrixproject.eu';

export const PLATFORM_URL: string = import.meta.env.VITE_PLATFORM_URL || 'https://platform.fabrixproject.eu';

/*
 * Left untyped on purpose (as in the Learning Hub): the SDK's schema generic
 * infers nested relational selections poorly. Each query in the features
 * returns one of the app types in ./types.ts.
 */
export const directus = createDirectus(DIRECTUS_URL).with(rest());

export { readItems };

type AssetParams = { width?: number; height?: number; fit?: 'cover' | 'contain' | 'inside'; quality?: number };

/** Directus serves transformed images; webp unless the caller needs the original. */
export function assetUrl(id: string | null | undefined, params: AssetParams = {}): string | undefined {
  if (!id) return undefined;
  const query = new URLSearchParams({ format: 'webp', quality: String(params.quality ?? 80) });
  if (params.width) query.set('width', String(params.width));
  if (params.height) query.set('height', String(params.height));
  if (params.fit) query.set('fit', params.fit);
  return `${DIRECTUS_URL}/assets/${id}?${query}`;
}

/** A file to download, not an image to display: original bytes, original name. */
export const downloadUrl = (id: string) => `${DIRECTUS_URL}/assets/${id}?download`;

export const PUBLISHED = { status: { _eq: 'published' } } as const;
