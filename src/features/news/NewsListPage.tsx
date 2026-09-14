import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { NewsGrid } from './NewsGrid';

export function NewsListPage() {
  useDocumentTitle('News', 'News from the FABRIX project: events, open calls, publications and results.');
  return (
    <div className="container mx-auto mt-12 min-h-screen rounded-3xl bg-white p-6 md:p-12">
      <NewsGrid />
    </div>
  );
}
