import { queryOptions } from '@tanstack/react-query';
import { directus, PUBLISHED, readItems } from '../../lib/directus';
import type { News, NewsCard } from '../../lib/types';

const CARD_FIELDS = ['id', 'slug', 'title', 'date', 'pinned', 'cover'];

const gallery = (field: string) => [
  `${field}.id`, `${field}.sort`,
  `${field}.directus_files_id.id`, `${field}.directus_files_id.title`, `${field}.directus_files_id.description`,
];

/** Pinned first, then newest first — the order of the home page and /news. */
export const newsListQueryOptions = () =>
  queryOptions({
    queryKey: ['news'],
    queryFn: async () =>
      (await directus.request(
        readItems('news', { fields: CARD_FIELDS, filter: PUBLISHED, sort: ['-pinned', '-date'], limit: -1 }),
      )) as NewsCard[],
  });

export const newsArticleQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['news', slug],
    queryFn: async () => {
      const rows = (await directus.request(
        readItems('news', {
          fields: [...CARD_FIELDS, 'body', 'body_2', ...gallery('gallery'), ...gallery('gallery_2')],
          filter: { ...PUBLISHED, slug: { _eq: slug } },
          limit: 1,
        }),
      )) as News[];
      return rows[0] ?? null;
    },
  });
