import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { assetUrl } from '../../lib/directus';
import type { Partner } from '../../lib/types';

/**
 * One consortium member on /partners. Rows alternate sides and colours; the
 * description is clamped to four lines with a toggle, shown only when it
 * actually overflows at the current width.
 */
export function PartnerRow({ partner, index }: { partner: Partner; index: number }) {
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

  const even = index % 2 === 0;

  return (
    <div
      id={partner.key}
      className="mx-4 my-8 flex scroll-mt-8 flex-col gap-6 p-8 text-lg leading-normal text-darkblue odd:bg-owncyan even:bg-ownindigo md:flex-row md:gap-0"
    >
      <div className={clsx(even ? 'md:order-1 md:pl-8' : 'md:order-2 md:pr-8')}>
        <h3 className="mb-4 text-xl leading-tight">{partner.name}</h3>
        <div className="flex items-start gap-2">
          <p ref={text} id={`${partner.key}-blurb`} className={clsx('font-plex text-xs', !expanded && 'line-clamp-4')}>
            {partner.blurb}
          </p>
          {overflows && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              aria-controls={`${partner.key}-blurb`}
              aria-label={expanded ? 'Show less' : 'Read more'}
              className="mt-2 flex-none"
            >
              {expanded ? (
                <ChevronUp className="size-6 rounded-full border border-darkblue" />
              ) : (
                <ChevronDown className="size-6 rounded-full border border-darkblue" />
              )}
            </button>
          )}
        </div>
      </div>
      <div className={clsx('flex-none md:mx-8 md:min-w-[200px]', even ? 'md:order-2' : 'md:order-1')}>
        <a href={partner.url ?? undefined} target="_blank" rel="noreferrer" aria-label={`${partner.name} website`}>
          <img
            src={assetUrl(partner.logo, { width: 400, quality: 90 })}
            alt={partner.name}
            width={200}
            height={133}
            loading="lazy"
            className="bg-white"
          />
        </a>
      </div>
    </div>
  );
}
