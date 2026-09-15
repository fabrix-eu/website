import { useSuspenseQuery } from '@tanstack/react-query';
import { RichHtml } from '../../components/RichHtml';
import { assetUrl } from '../../lib/directus';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { newsArticleQueryOptions } from './queries';
import { NewsGallery } from './NewsGallery';

const BODY = 'font-plex prose mx-auto p-4 text-lg text-darkblue prose-headings:text-darkblue prose-strong:text-darkblue md:pr-48 md:pl-0';

export function NewsArticle({ slug }: { slug: string }) {
  // The route loader throws notFound() before this renders when there is no such article.
  const post = useSuspenseQuery(newsArticleQueryOptions(slug)).data!;
  useDocumentTitle(post.title);

  return (
    <article className="my-20 mb-96 h-full">
      <header className="prose mx-auto px-4 text-lg md:px-0">
        <h1 className="text-3xl font-bold text-darkblue">{post.title}</h1>
        <time dateTime={post.date} className="mb-8 block text-darkblue">
          {new Date(post.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
      </header>

      {/* The cover keeps its own proportions: no fixed height, no crop — an event
          poster or a portrait photo must show whole, not squeezed or off-centre. */}
      {post.cover && (
        <div className="mx-auto mb-12 max-w-[800px] px-4 md:px-0">
          <img src={assetUrl(post.cover, { width: 1600 })} alt="" className="mx-auto h-auto w-full rounded-3xl" />
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
