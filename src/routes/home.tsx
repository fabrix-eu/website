import { Link } from '@tanstack/react-router';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { NewsGrid } from '../features/news/NewsGrid';
import { PartnersCarousel } from '../features/partners/PartnersCarousel';
import { NewsletterForm } from '../features/newsletter/NewsletterForm';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const footerShape = (position: string) => ({
  backgroundImage: "url('/images/footer_background.webp')",
  backgroundSize: '100%',
  backgroundPosition: position,
});

export function HomePage() {
  useDocumentTitle();

  return (
    <div className="flex flex-col">
      <div className="absolute top-0 z-0 h-[calc(100vh+100px)] w-full bg-cover bg-no-repeat opacity-90" style={{ backgroundImage: "url('/images/background_cover.webp')" }} aria-hidden />
      <div
        className="absolute top-0 left-0 z-10 h-full w-full bg-no-repeat opacity-90"
        style={{ backgroundImage: "url('/images/geometrical_shapes_top.webp')", backgroundSize: '1200px', backgroundPosition: '-300px -400px' }}
        aria-hidden
      />

      <header className="relative z-30">
        <Nav white />
        <div className="relative z-40 container mx-auto my-12 lg:my-32">
          <div className="flex flex-col justify-center px-4 text-white">
            <h1 className="text-3xl md:text-4xl lg:mx-24 lg:text-5xl xl:mx-48">
              Fostering local, beautiful, and sustainably designed regenerative textile and clothing ecosystems
            </h1>
            <p className="font-plex mt-6 text-xl md:text-3xl lg:mx-24 xl:mx-48">in Rotterdam and Athens and across Europe.</p>
            <div className="mt-14 flex justify-center">
              <Link to="/about" className="rounded-xl border border-white px-4 py-2 text-xl md:rounded-2xl md:px-8 md:py-4 md:text-2xl">
                Find out more
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative bg-white pt-[100px]">
          <div
            className="absolute top-[-283px] z-20 h-full w-full bg-no-repeat"
            style={{ backgroundImage: "url('/images/geometrical_shapes_bottom.webp')", backgroundSize: '1000px', backgroundPosition: 'right top' }}
            aria-hidden
          />
          <NewsGrid limit={4} />
        </section>

        <section className="relative flex min-h-screen flex-col bg-white">
          <div className="absolute z-30 h-full min-h-screen w-full rotate-180 -scale-x-100 bg-no-repeat opacity-80 lg:h-1/2" style={footerShape('bottom left')} aria-hidden />
          <div className="absolute z-0 h-full w-full bg-no-repeat opacity-80" style={footerShape('bottom right')} aria-hidden />
          <PartnersCarousel />
          <div className="relative bg-transparent">
            <NewsletterForm />
            <footer className="relative z-10 pb-12">
              <Footer />
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
