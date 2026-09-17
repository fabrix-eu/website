import { PageHeader } from '../../components/PageHeader';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { NewsGrid } from './NewsGrid';

export function NewsListPage() {
  useDocumentTitle('News', 'News from the FABRIX project: events, open calls, publications and results.');
  return (
    <>
      <PageHeader title="News">
        <p>News from the FABRIX project: events, open calls, publications and results.</p>
      </PageHeader>
      <NewsGrid />
    </>
  );
}
