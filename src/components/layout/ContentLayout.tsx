import { Outlet } from '@tanstack/react-router';
import { Nav } from './Nav';
import { PageEnd } from './PageEnd';

/** Every page but the home: shared header, the page, then the halo and the footer. */
export function ContentLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Nav />
      <main className="grow">
        <Outlet />
      </main>
      <PageEnd />
    </div>
  );
}
