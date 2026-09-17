import type { ReactNode } from 'react';
import { CoverPanel } from './CoverPanel';
import { Eyebrow } from './Section';

/** The header every inner page opens with: title and intro on the cover panel. */
export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <CoverPanel className="py-12 sm:py-16">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-fx-display text-fx-ink sm:text-[44px]">{title}</h1>
      {children && <div className="mt-5 flex max-w-2xl flex-col gap-3 text-fx-lead text-fx-ink2">{children}</div>}
    </CoverPanel>
  );
}
