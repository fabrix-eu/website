import { Link } from '@tanstack/react-router';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="container mx-auto px-8 py-24 text-center text-darkblue">
      <h1 className="text-3xl md:text-5xl">We couldn’t find that page</h1>
      <p className="font-plex mx-auto mt-6 max-w-md text-lg">The page may have moved, or the link may be incomplete.</p>
      <Link to="/" className="mt-10 inline-block rounded-xl border border-darkblue px-6 py-3 text-xl">
        Back to the home page
      </Link>
    </div>
  );
}
