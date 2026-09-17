import type { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * The site's cover — the two cities in the violet-to-rose wash, with the
 * network mesh — as a large rounded panel, washed to white on the text side.
 * The home hero and every page header are drawn on it: it is what the site
 * kept from its first design.
 */
export function CoverPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-6">
      <div className="relative overflow-hidden rounded-fx-xl bg-fx-violet-soft">
        <img src="/images/background_cover.webp" alt="" className="absolute inset-0 size-full object-cover" />
        <img
          src="/images/geometrical_shapes_top.webp"
          alt=""
          className="absolute -top-10 -right-48 hidden w-[900px] max-w-none -scale-x-100 opacity-80 sm:block"
        />
        <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/75 to-white/0 max-sm:via-white/85 max-sm:to-white/50" />
        <div className={clsx('relative max-w-3xl px-6 sm:px-12', className)}>{children}</div>
      </div>
    </section>
  );
}
