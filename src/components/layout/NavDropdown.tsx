import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link } from '@tanstack/react-router';
import type { NavItem } from './navLinks';

type Props = { label: string; items: NonNullable<NavItem['submenu']> };

/** Desktop submenu. Radix handles focus, Escape, outside click and keyboard navigation. */
export function NavDropdown({ label, items }: Props) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="text-[15px] font-medium text-fx-ink2 outline-hidden transition hover:text-fx-ink focus-visible:text-fx-ink data-[state=open]:font-extrabold data-[state=open]:text-fx-ink">
        {label}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={18}
          className="z-50 w-56 rounded-fx border border-fx-line bg-white p-1.5 shadow-[0_18px_40px_-22px_rgba(26,26,34,0.55)]"
        >
          {items.map((item) => (
            <DropdownMenu.Item key={item.label} asChild>
              <Link
                {...item.link}
                className="block rounded-fx-sm px-3 py-2 font-fx text-fx-body text-fx-ink2 outline-hidden transition data-highlighted:bg-fx-violet-soft data-highlighted:text-fx-ink"
              >
                {item.label}
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
