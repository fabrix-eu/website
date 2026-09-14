import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ExternalLink, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { NAV } from './navLinks';
import { NavDropdown } from './NavDropdown';
import { MobileNav } from './MobileNav';

/** `white` is the home variant, drawn over the cover photo. */
export function Nav({ white = false }: { white?: boolean }) {
  const [open, setOpen] = useState(false);
  const tone = white ? 'text-white border-white' : 'text-darkblue border-darkblue';

  return (
    <nav className={clsx('container mx-auto border-b px-6 pt-8 pb-4', tone)} aria-label="Main">
      <div className="flex justify-between">
        <Link to="/" aria-label="FABRIX home">
          <img src="/fabrix-logo.svg" alt="FABRIX" width={150} height={46} />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="ml-auto inline-flex rounded-sm p-3 outline-hidden md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        <ul className="mt-2 hidden items-center gap-1 md:flex lg:gap-4">
          {NAV.map((item) => (
            <li key={item.label}>
              {item.submenu ? (
                <NavDropdown label={item.label} items={item.submenu} />
              ) : item.external ? (
                <a
                  href={item.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-md px-3 py-2 whitespace-nowrap hover:underline lg:px-5"
                >
                  {item.label}
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              ) : (
                <Link
                  {...item.link}
                  className="block rounded-md border border-transparent px-3 py-2 whitespace-nowrap hover:underline lg:px-5"
                  activeOptions={{ exact: true }}
                  activeProps={{ className: clsx('hover:no-underline', white ? '!border-white' : '!border-darkblue') }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {open && <MobileNav white={white} onNavigate={() => setOpen(false)} />}
    </nav>
  );
}
