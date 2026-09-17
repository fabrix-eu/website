import type { ReactNode } from 'react';
import { Footer } from './Footer';

/**
 * The end of every page: the soft halo of the first design as the ground,
 * with the footer (and, on the home page, the newsletter) on it as white cards.
 */
export function PageEnd({ children }: { children?: ReactNode }) {
  return (
    <div className="relative mt-24 overflow-hidden pt-8">
      <img
        src="/images/footer_background.webp"
        alt=""
        loading="lazy"
        className="absolute inset-x-0 top-2 h-[calc(100%-0.5rem)] w-full object-cover object-bottom"
      />
      <img
        src="/images/footer_background.webp"
        alt=""
        loading="lazy"
        className="absolute inset-x-0 top-2 h-[calc(100%-0.5rem)] w-full rotate-180 object-cover object-bottom opacity-50"
      />
      {/* Images start under the fade: their top edge, on a fractional pixel, drew a grey hairline. */}
      <div className="absolute inset-x-0 top-0 h-56 bg-linear-to-b from-white to-white/0" />
      <div className="relative">
        {children}
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  );
}
