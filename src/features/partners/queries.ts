import { queryOptions } from '@tanstack/react-query';
import { directus, readItems } from '../../lib/directus';
import type { Partner } from '../../lib/types';

/**
 * `partners` is shared with the Learning Hub, which lists every contributor.
 * The website shows the consortium only: rows flagged `on_website`, in their
 * hand-set order.
 */
export const websitePartnersQueryOptions = () =>
  queryOptions({
    queryKey: ['partners', 'website'],
    queryFn: async () =>
      (await directus.request(
        readItems('partners', {
          fields: ['key', 'name', 'short', 'url', 'blurb', 'logo', 'logo_mono', 'sort'],
          filter: { on_website: { _eq: true } },
          sort: ['sort', 'name'],
          limit: -1,
        }),
      )) as Partner[],
  });
