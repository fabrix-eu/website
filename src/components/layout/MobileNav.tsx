import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { NAV, SURFACES } from './navLinks';
import { SocialLinks } from './social';

/**
 * Narrow screens. Submenus are laid out inline rather than behind a second
 * tap, and the bar's right-hand side (Contact, the social links) and the
 * surface switcher move in here.
 */
const ITEM = 'flex items-center gap-2 rounded-fx-sm px-3 py-2.5 text-fx-lead font-medium text-fx-ink2 transition hover:bg-fx-violet-soft hover:text-fx-ink';
const LABEL = 'px-3 pt-3 pb-1 text-fx-label text-fx-muted uppercase';

export function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="border-t border-fx-line bg-white px-3 pt-2 pb-4 lg:hidden" aria-label="Main">
      <ul className="flex flex-col">
        {NAV.map((item) => (
          <li key={item.label}>
            {item.submenu ? (
              <>
                <span className={LABEL}>{item.label}</span>
                <ul className="flex flex-col">
                  {item.submenu.map((sub) => (
                    <li key={sub.label}>
                      <Link {...sub.link} onClick={onNavigate} className={ITEM}>
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link {...item.link} onClick={onNavigate} className={ITEM} activeProps={{ className: '!font-extrabold !text-fx-ink' }}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
        <li>
          <Link to="/contact" onClick={onNavigate} className={ITEM} activeProps={{ className: '!font-extrabold !text-fx-ink' }}>
            Contact
          </Link>
        </li>
      </ul>

      <span className={LABEL}>FABRIX</span>
      <ul className="flex flex-col">
        {SURFACES.filter((surface) => surface.href).map((surface) => (
          <li key={surface.label}>
            <a href={surface.href!} className={ITEM}>
              {surface.label}
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </li>
        ))}
      </ul>

      <SocialLinks
        className="mt-3 px-3"
        linkClassName="flex rounded-fx-sm border border-fx-line p-2.5 text-fx-ink2 transition hover:border-fx-violet-border hover:text-fx-violet"
        iconClassName="size-5"
      />
    </nav>
  );
}
