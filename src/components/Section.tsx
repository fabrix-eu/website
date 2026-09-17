import type { ReactNode } from 'react';
import clsx from 'clsx';

/** Small violet capitals above a heading. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx('mb-3 text-fx-label text-fx-violet uppercase', className)}>{children}</p>;
}

/** A section's heading row: eyebrow and title on the left, an optional action on the right. */
export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-fx-title text-fx-ink sm:text-fx-display">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/** The page's content column, under the header. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('mx-auto max-w-6xl px-5', className)}>{children}</div>;
}

export const BUTTON =
  'inline-flex items-center justify-center gap-2 rounded-fx-action bg-fx-violet px-5 py-3 text-fx-body font-bold text-white transition hover:brightness-110 disabled:opacity-60';
export const BUTTON_SECONDARY =
  'inline-flex items-center justify-center gap-2 rounded-fx-action border border-fx-line2 bg-white px-5 py-3 text-fx-body font-bold text-fx-ink transition hover:border-fx-violet-border hover:text-fx-violet';
export const TEXT_LINK = 'inline-flex items-center gap-1.5 text-fx-body font-bold text-fx-violet transition hover:underline';
