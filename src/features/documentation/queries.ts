import { queryOptions } from '@tanstack/react-query';
import { directus, readItems } from '../../lib/directus';
import type { Deliverable, Publication } from '../../lib/types';

export const documentationQueryOptions = () =>
  queryOptions({
    queryKey: ['documentation'],
    queryFn: async () => {
      const [publications, deliverables] = await Promise.all([
        directus.request(readItems('publications', { fields: ['*'], sort: ['sort'], limit: -1 })),
        directus.request(readItems('deliverables', { fields: ['*'], sort: ['sort'], limit: -1 })),
      ]);
      return { publications: publications as Publication[], deliverables: deliverables as Deliverable[] };
    },
  });
