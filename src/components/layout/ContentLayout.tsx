import { Outlet } from '@tanstack/react-router';
import { Nav } from './Nav';
import { Footer } from './Footer';

const shape = { backgroundImage: "url('/images/footer_background.webp')", backgroundSize: '100%', backgroundPosition: 'bottom' };

export function ContentLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      <div className="absolute z-0 h-full w-full rotate-180 bg-no-repeat opacity-90" style={shape} aria-hidden />
      <div className="absolute z-0 h-full w-full grow bg-no-repeat opacity-90" style={shape} aria-hidden />

      <div className="z-20 h-full w-full grow bg-transparent">
        <header>
          <Nav />
        </header>
        <main>
          <Outlet />
        </main>
      </div>

      <footer className="relative z-50">
        <Footer />
      </footer>
    </div>
  );
}
