import { linkOptions, type LinkProps } from '@tanstack/react-router';
import { PLATFORM_URL } from '../../lib/directus';

export const LEARN_URL = 'https://learn.fabrixproject.eu';

/** The open data surface. Not live yet: while null, the home page shows it as "Soon". */
export const DATA_URL: string | null = null;

type Internal = { label: string; link: LinkProps };

export type NavItem =
  | (Internal & { submenu?: never })
  | { label: string; submenu: Internal[]; link?: never };

/**
 * This surface's own sections, flat, as the shared menu spec lists them
 * (Platform landing page_Sept2026): About · Partners · Cities · EU Documentation.
 * News is the site's own section and stays. Contact and the social links sit on
 * the right of the bar, not here.
 */
export const NAV: NavItem[] = [
  { label: 'About', link: linkOptions({ to: '/about' }) },
  { label: 'Partners', link: linkOptions({ to: '/partners' }) },
  {
    label: 'Cities',
    submenu: [
      { label: 'Rotterdam', link: linkOptions({ to: '/cities/$slug', params: { slug: 'rotterdam' } }) },
      { label: 'Athens', link: linkOptions({ to: '/cities/$slug', params: { slug: 'athens' } }) },
    ],
  },
  { label: 'EU Documentation', link: linkOptions({ to: '/documentation' }) },
  { label: 'News', link: linkOptions({ to: '/news' }) },
];

/**
 * The three FABRIX surfaces. The current one is written next to the logo, as
 * part of it; the other two are one click away, each going to its own home.
 */
export const SURFACES = [
  { label: 'Project', href: null, blurb: 'The project and its cities' },
  { label: 'Platform', href: PLATFORM_URL, blurb: 'Map, marketplace, Compass' },
  { label: 'Learning Hub', href: LEARN_URL, blurb: 'Guides and case studies' },
] as const;

export const CURRENT_SURFACE = 'Project';
