import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { NAV } from './navLinks';
import { NavDropdown } from './NavDropdown';
import { MobileNav } from './MobileNav';
import { SurfaceSwitcher } from './SurfaceSwitcher';
import { SocialLinks } from './social';

/**
 * The shared FABRIX header, as specified for all three surfaces: wordmark, the
 * name of this surface (which switches to the other two), this surface's own
 * sections, then Contact and the social links. Structure and tokens come from
 * the design system (platform.fabrixproject.eu/design); do not re-pick them here.
 */
// Sizes match the Learning Hub's bar to the pixel: 18px surface label, 15px links 24px apart.
const LINK = 'text-[15px] font-medium text-fx-ink2 transition hover:text-fx-ink';

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-fx-line bg-white/95 font-fx backdrop-blur">
      <div className="mx-auto flex h-topbar max-w-6xl items-center gap-4 px-5">
        <div className="flex flex-none items-center gap-2.5">
          <Link to="/" aria-label="FABRIX home">
            <img src="/fabrix-logo.svg" alt="FABRIX" className="h-7 w-auto" />
          </Link>
          <span className="h-5 w-px bg-fx-line2" aria-hidden />
          <SurfaceSwitcher />
        </div>

        <nav className="ml-6 hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV.map((item) =>
            item.submenu ? (
              <NavDropdown key={item.label} label={item.label} items={item.submenu} />
            ) : (
              <Link key={item.label} {...item.link} className={LINK} activeProps={{ className: '!font-extrabold !text-fx-ink' }}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <Link to="/contact" className={LINK} activeProps={{ className: '!font-extrabold !text-fx-ink' }}>
            Contact
          </Link>
          <span className="h-5 w-px bg-fx-line2" aria-hidden />
          <SocialLinks className="gap-3" linkClassName="flex text-fx-ink2 transition hover:text-fx-violet" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="-mr-2 ml-auto inline-flex rounded-fx-sm p-2 text-fx-ink2 outline-hidden lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && <MobileNav onNavigate={() => setOpen(false)} />}
    </header>
  );
}
