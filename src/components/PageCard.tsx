import type { ReactNode } from 'react';
import clsx from 'clsx';

/** The white rounded panel most inner pages open with: short rule, title, then content. */
export function PageCard({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={clsx('container mx-auto mt-12 rounded-3xl bg-white p-8 md:p-24', className)}>
      {title && (
        <>
          <div className="mb-2 w-16 border-t border-darkblue" />
          <h1 className="pb-4 text-2xl text-darkblue md:pb-8 md:text-4xl">{title}</h1>
        </>
      )}
      {children}
    </div>
  );
}
