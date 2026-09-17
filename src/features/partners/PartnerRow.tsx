import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import { BlurImage } from '../../components/BlurImage';
import type { Partner } from '../../lib/types';

/**
 * One consortium member on /partners, as a card. The description is clamped
 * to five lines with a toggle, shown only when it actually overflows at the
 * current width. The home carousel links here by `#key`.
 */
export function PartnerRow({ partner }: { partner: Partner }) {
  const text = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = text.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollHeight > el.clientHeight || expanded);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded]);

  return (
    <article
      id={partner.key}
      className="flex scroll-mt-[calc(var(--spacing-topbar)+1rem)] flex-col rounded-fx border border-fx-line bg-white p-6 target:border-fx-violet-border target:ring-4 target:ring-fx-violet-soft"
    >
      <div className="flex h-20 items-center">
        <BlurImage
          id={partner.logo}
          width={400}
          quality={90}
          blur={false}
          alt={partner.name}
          frameClassName="h-full w-[220px] max-w-full"
          className="size-full object-contain object-left"
        />
      </div>
      <h2 className="mt-5 text-fx-heading text-fx-ink">{partner.name}</h2>
      <p ref={text} id={`${partner.key}-blurb`} className={clsx('mt-2 text-fx-body text-fx-ink2', !expanded && 'line-clamp-5')}>
        {partner.blurb}
      </p>
      <div className="mt-auto flex items-center justify-between gap-4 pt-4">
        {overflows ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={`${partner.key}-blurb`}
            className="text-fx-body font-bold text-fx-ink hover:text-fx-violet"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        ) : (
          <span />
        )}
        {partner.url && (
          <a href={partner.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-fx-body font-bold text-fx-violet hover:underline">
            Website
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        )}
      </div>
    </article>
  );
}
