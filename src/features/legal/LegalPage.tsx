import { useSuspenseQuery } from '@tanstack/react-query';
import { Markdown } from '../../components/Markdown';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { legalPageQueryOptions } from './queries';

/** The body carries its own title (`# PRIVACY POLICY`), so the page is the text alone. */
export function LegalPage({ slug }: { slug: string }) {
  const page = useSuspenseQuery(legalPageQueryOptions(slug)).data!;
  useDocumentTitle(page.title);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-6">
      <div className="rounded-fx-xl border border-fx-line bg-fx-panel px-6 py-10 sm:px-12 sm:py-14">
        <div className="prose max-w-3xl prose-h1:text-fx-display prose-h2:text-fx-heading">
          <Markdown>{page.body}</Markdown>
        </div>
      </div>
    </div>
  );
}
