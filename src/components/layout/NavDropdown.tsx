import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link } from '@tanstack/react-router';
import type { NavItem } from './navLinks';

type Props = { label: string; items: NonNullable<NavItem['submenu']> };

/** Desktop submenu. Radix handles focus, Escape, outside click and keyboard navigation. */
export function NavDropdown({ label, items }: Props) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="rounded-t-md px-3 py-2 whitespace-nowrap outline-hidden hover:underline focus-visible:underline data-[state=open]:bg-darkblue data-[state=open]:text-white lg:px-5">
        {label}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={0}
          className="z-50 w-48 rounded-b-md bg-darkblue/50 pt-8 shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
        >
          {items.map((item) => (
            <DropdownMenu.Item key={item.label} asChild>
              <Link
                {...item.link}
                className="block px-4 py-2 text-sm text-white outline-hidden data-highlighted:underline"
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
