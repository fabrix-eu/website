import { Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { RichHtml } from '../../components/RichHtml';
import { BlurImage } from '../../components/BlurImage';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { newsArticleQueryOptions } from './queries';
import { NewsGallery } from './NewsGallery';
import { formatDate } from './NewsGrid';

const BODY = 'prose mx-auto max-w-3xl px-5 prose-p:text-fx-lead prose-li:text-fx-lead';

export function NewsArticle({ slug }: { slug: string }) {
  // The route loader throws notFound() before this renders when there is no such article.
  const post = useSuspenseQuery(newsArticleQueryOptions(slug)).data!;
  useDocumentTitle(post.title);

  return (
    <article className="pt-10">
      <header className="mx-auto max-w-3xl px-5">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-fx-body font-bold text-fx-ink2 hover:text-fx-violet">
          <ArrowLeft className="size-4" aria-hidden />
          News
        </Link>
        <time dateTime={post.date} className="mt-8 block text-fx-label text-fx-violet uppercase">
          {formatDate(post.date, 'long')}
        </time>
        <h1 className="mt-3 text-fx-title text-fx-ink sm:text-fx-display">{post.title}</h1>
      </header>

      {/* The cover keeps its own proportions: no fixed height, no crop — an event
          poster or a portrait photo must show whole, not squeezed or off-centre. */}
      {post.cover && (
        <div className="mx-auto mt-8 mb-10 max-w-3xl px-5">
          <BlurImage
            id={post.cover.id}
            width={1600}
            dims={post.cover}
            loading="eager"
            frameClassName="mx-auto rounded-fx-lg"
            className="h-auto w-full"
          />
        </div>
      )}

      <section>
        <RichHtml html={post.body} className={BODY} />
        <NewsGallery items={post.gallery} />
      </section>

      {post.body_2 && (
        <section className="mt-12">
          <RichHtml html={post.body_2} className={BODY} />
          <NewsGallery items={post.gallery_2} />
        </section>
      )}
    </article>
  );
}
