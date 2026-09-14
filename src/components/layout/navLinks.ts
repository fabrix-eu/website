import { linkOptions, type LinkProps } from '@tanstack/react-router';
import { PLATFORM_URL } from '../../lib/directus';

type Internal = { label: string; link: LinkProps };

export type NavItem =
  | (Internal & { submenu?: never; external?: never })
  | { label: string; submenu: Internal[]; link?: never; external?: never }
  | { label: string; external: string; link?: never; submenu?: never };

export const NAV: NavItem[] = [
  {
    label: 'About',
    submenu: [
      { label: 'About FABRIX', link: linkOptions({ to: '/about' }) },
      { label: 'Partners', link: linkOptions({ to: '/partners' }) },
      { label: 'EU Documentation', link: linkOptions({ to: '/documentation' }) },
    ],
  },
  {
    label: 'Communities',
    submenu: [
      { label: 'Rotterdam', link: linkOptions({ to: '/cities/$slug', params: { slug: 'rotterdam' } }) },
      { label: 'Athens', link: linkOptions({ to: '/cities/$slug', params: { slug: 'athens' } }) },
    ],
  },
  { label: 'Platform', external: PLATFORM_URL },
  { label: 'News', link: linkOptions({ to: '/news' }) },
  { label: 'Contact', link: linkOptions({ to: '/contact' }) },
];
