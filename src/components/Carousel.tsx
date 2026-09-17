import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ARROW =
  'flex rounded-fx-action border border-fx-line2 bg-white p-2.5 text-fx-ink transition hover:border-fx-violet-border hover:text-fx-violet disabled:pointer-events-none disabled:opacity-40';

/**
 * Horizontal scroll-snap strip with previous / next buttons. Children size
 * themselves. An arrow is disabled when there is nothing more to scroll that way.
 */
export function Carousel({ children, gap, label }: { children: ReactNode; gap: number; label: string }) {
  const strip = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 0);
      setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 24);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, []);

  const scroll = (direction: -1 | 1) => {
    const el = strip.current;
    if (el) el.scrollBy({ left: direction * (el.clientWidth + gap), behavior: 'smooth' });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={strip} className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth" style={{ gap }}>
        {children}
      </div>
      {!(atStart && atEnd) && (
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => scroll(-1)} disabled={atStart} aria-label="Previous" className={ARROW}>
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={atEnd} aria-label="Next" className={ARROW}>
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
