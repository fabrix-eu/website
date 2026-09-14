import { useSuspenseQuery } from '@tanstack/react-query';
import { Markdown } from '../../components/Markdown';
import { PageCard } from '../../components/PageCard';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { legalPageQueryOptions } from './queries';

export function LegalPage({ slug }: { slug: string }) {
  const page = useSuspenseQuery(legalPageQueryOptions(slug)).data!;
  useDocumentTitle(page.title);

  return (
    <PageCard className="min-h-screen">
      <div className="prose max-w-3xl">
        <Markdown>{page.body}</Markdown>
      </div>
    </PageCard>
  );
}
