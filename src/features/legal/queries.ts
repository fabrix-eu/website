import { queryOptions } from '@tanstack/react-query';
import { directus, readItems } from '../../lib/directus';
import type { LegalPage } from '../../lib/types';

export const legalPageQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['legal', slug],
    queryFn: async () => {
      const rows = (await directus.request(
        readItems('legal_pages', { fields: ['*'], filter: { slug: { _eq: slug } }, limit: 1 }),
      )) as LegalPage[];
      return rows[0] ?? null;
    },
  });
