import { Link } from '@tanstack/react-router';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { CoverPanel } from './CoverPanel';
import { BUTTON, Eyebrow } from './Section';

export function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="pb-6">
      <CoverPanel className="py-16 sm:py-24">
        <Eyebrow>404</Eyebrow>
        <h1 className="text-fx-display text-fx-ink sm:text-fx-hero">We couldn’t find that page</h1>
        <p className="mt-5 max-w-md text-fx-lead text-fx-ink2">The page may have moved, or the link may be incomplete.</p>
        <Link to="/" className={`${BUTTON} mt-8`}>
          Back to the home page
        </Link>
      </CoverPanel>
    </div>
  );
}
