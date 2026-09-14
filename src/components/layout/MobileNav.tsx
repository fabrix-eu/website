import { Link } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { NAV } from './navLinks';

/**
 * Narrow screens. Submenus are laid out inline rather than behind a second
 * tap: five destinations do not need a nested overlay.
 */
export function MobileNav({ white, onNavigate }: { white: boolean; onNavigate: () => void }) {
  const link = clsx('flex items-center gap-2 px-3 py-2 text-xl leading-snug uppercase', white ? 'text-white' : 'text-darkblue hover:text-lightblue');

  return (
    <ul className="mt-8 flex flex-col md:hidden">
      {NAV.map((item) => (
        <li key={item.label}>
          {item.submenu ? (
            <>
              <span className={clsx(link, 'opacity-70')}>{item.label}</span>
              <ul className="mb-2 pl-4">
                {item.submenu.map((sub) => (
                  <li key={sub.label}>
                    <Link {...sub.link} onClick={onNavigate} className={clsx(link, 'text-base normal-case')}>
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : item.external ? (
            <a href={item.external} target="_blank" rel="noopener noreferrer" className={link}>
              {item.label}
              <ExternalLink className="size-4" aria-hidden />
            </a>
          ) : (
            <Link {...item.link} onClick={onNavigate} className={link}>
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
