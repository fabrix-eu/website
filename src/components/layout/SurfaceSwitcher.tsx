import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { CURRENT_SURFACE, SURFACES } from './navLinks';

/**
 * The name of the surface you are on, written next to the wordmark as if it
 * were part of the logo — the Learning Hub's pattern, now shared by all three
 * FABRIX surfaces. It opens the other two; each entry goes to that surface's
 * home.
 */
export function SurfaceSwitcher() {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="flex items-center gap-1 text-[18px] font-medium whitespace-nowrap text-fx-ink2 outline-hidden transition hover:text-fx-ink data-[state=open]:text-fx-ink">
        {CURRENT_SURFACE}
        <ChevronDown className="size-4 text-fx-muted" aria-hidden />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={16}
          className="z-50 w-64 rounded-fx border border-fx-line bg-white p-1.5 shadow-[0_18px_40px_-22px_rgba(26,26,34,0.55)]"
        >
          {SURFACES.map((surface) => {
            const content = (
              <>
                <span className="flex items-center gap-1.5 font-bold text-fx-ink">
                  {surface.label}
                  {surface.href && <ArrowUpRight className="size-3.5 text-fx-muted" aria-hidden />}
                </span>
                <span className="block text-fx-small text-fx-muted">{surface.blurb}</span>
              </>
            );
            const className =
              'block rounded-fx-sm px-3 py-2 font-fx text-fx-body outline-hidden transition data-highlighted:bg-fx-violet-soft';

            return (
              <DropdownMenu.Item key={surface.label} asChild>
                {surface.href ? (
                  <a href={surface.href} className={className}>
                    {content}
                  </a>
                ) : (
                  <Link to="/" className={`${className} bg-fx-violet-soft`} aria-current="page">
                    {content}
                  </Link>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
