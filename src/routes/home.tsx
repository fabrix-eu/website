import { Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Nav } from '../components/layout/Nav';
import { PageEnd } from '../components/layout/PageEnd';
import { CoverPanel } from '../components/CoverPanel';
import { BUTTON, BUTTON_SECONDARY, Eyebrow } from '../components/Section';
import { DATA_URL, LEARN_URL } from '../components/layout/navLinks';
import { PLATFORM_URL } from '../lib/directus';
import { NewsGrid } from '../features/news/NewsGrid';
import { PartnersCarousel } from '../features/partners/PartnersCarousel';
import { NewsletterForm } from '../features/newsletter/NewsletterForm';
import { useDocumentTitle } from '../lib/useDocumentTitle';

/** The other FABRIX surfaces, one step below "Find out more". */
const SURFACE_LINKS = [
  { label: 'Platform', href: PLATFORM_URL },
  { label: 'Learning Hub', href: LEARN_URL },
  { label: 'Data', href: DATA_URL },
];

function Hero() {
  return (
    <CoverPanel className="py-16 sm:py-24">
      <Eyebrow>Rotterdam · Athens · Europe</Eyebrow>
      <h1 className="text-fx-display text-fx-ink sm:text-fx-hero">
        Fostering local, beautiful, and sustainably designed regenerative textile and clothing ecosystems
      </h1>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/about" className={BUTTON}>
          Find out more
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        {SURFACE_LINKS.map((surface) =>
          surface.href ? (
            <a key={surface.label} href={surface.href} className={BUTTON_SECONDARY}>
              {surface.label}
              <ArrowUpRight className="size-4 text-fx-muted" aria-hidden />
            </a>
          ) : (
            <span key={surface.label} className={`${BUTTON_SECONDARY} pointer-events-none text-fx-muted`} aria-disabled>
              {surface.label}
              <span className="rounded-full bg-fx-violet-soft px-2 py-0.5 text-fx-label text-fx-violet uppercase">Soon</span>
            </span>
          ),
        )}
      </div>
    </CoverPanel>
  );
}

export function HomePage() {
  useDocumentTitle();

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Nav />
      <main>
        <Hero />
        <NewsGrid limit={4} />
        <PartnersCarousel />
      </main>
      <PageEnd>
        <NewsletterForm />
      </PageEnd>
    </div>
  );
}
