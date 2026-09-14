import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Horizontal scroll-snap strip with the FABRIX arrow buttons. Children size
 * themselves (one card on mobile, three from md). An arrow is drawn hollow
 * when there is nothing more to scroll that way.
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
    <div className="relative z-50 container mx-auto pt-2" role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={strip} className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth" style={{ gap }}>
        {children}
      </div>
      <div className="my-8 flex justify-center space-x-4">
        <button type="button" onClick={() => scroll(-1)} disabled={atStart} aria-label="Previous">
          <img src={atStart ? '/icons/arrow_left.png' : '/icons/arrow_left_filled.png'} alt="" width={64} height={64} />
        </button>
        <button type="button" onClick={() => scroll(1)} disabled={atEnd} aria-label="Next">
          <img src={atEnd ? '/icons/arrow_left.png' : '/icons/arrow_left_filled.png'} alt="" width={64} height={64} className="mt-2 rotate-180" />
        </button>
      </div>
    </div>
  );
}
