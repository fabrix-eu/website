import { queryOptions } from '@tanstack/react-query';
import { directus, readItems } from '../../lib/directus';
import type { City } from '../../lib/types';

export const cityQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['cities', slug],
    queryFn: async () => {
      const rows = (await directus.request(
        readItems('cities', { fields: ['*', 'cover.id', 'cover.width', 'cover.height'], filter: { slug: { _eq: slug } }, limit: 1 }),
      )) as City[];
      return rows[0] ?? null;
    },
  });
