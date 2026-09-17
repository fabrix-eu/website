import type { ReactNode } from 'react';

/**
 * The project's social accounts. The marks are drawn inline rather than pulled
 * from the icon set, which carries no brand icons — the same two paths as the
 * Learning Hub's footer, so the family shows one pair of marks.
 */
export const SOCIAL: { label: string; href: string; path: ReactNode }[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/101634457/',
    path: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/fabrixproject/',
    path: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </>
    ),
  },
];

type Props = { className?: string; linkClassName?: string; iconClassName?: string };

export function SocialLinks({ className = '', linkClassName = '', iconClassName = 'size-[18px]' }: Props) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {SOCIAL.map((network) => (
        <li key={network.label}>
          <a
            href={network.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`FABRIX on ${network.label}`}
            className={linkClassName}
          >
            <svg
              viewBox="0 0 24 24"
              className={iconClassName}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {network.path}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
