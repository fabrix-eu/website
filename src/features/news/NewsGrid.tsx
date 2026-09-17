import { Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { BlurImage } from '../../components/BlurImage';
import { Container, SectionHeading, TEXT_LINK } from '../../components/Section';
import { newsListQueryOptions } from './queries';

export const formatDate = (date: string, month: 'short' | 'long' = 'short') =>
  new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month, year: 'numeric' });

/** The News cards: all articles on /news, the latest few (with a heading) on the home page. */
export function NewsGrid({ limit }: { limit?: number }) {
  const { data: news } = useSuspenseQuery(newsListQueryOptions());
  const shown = limit ? news.slice(0, limit) : news;

  return (
    // The cards sit on a tinted band, so they read as cards and not as boxes on white.
    <section className={clsx('bg-fx-violet-soft/60 py-16', limit ? 'mt-20' : 'mt-12')}>
      <Container>
        {limit && (
          <SectionHeading
            eyebrow="Latest"
            title="News"
            action={
              news.length > limit && (
                <Link to="/news" className={TEXT_LINK}>
                  All news
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              )
            }
          />
        )}

        <ul className={clsx('grid gap-5 sm:grid-cols-2', limit ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
          {shown.map((post) => (
            <li key={post.id}>
              <Link
                to="/news/$slug"
                params={{ slug: post.slug }}
                className="group flex h-full flex-col overflow-hidden rounded-fx border border-white bg-white transition hover:-translate-y-px hover:border-fx-line2 hover:shadow-[0_8px_24px_-14px_rgba(26,26,34,0.25)]"
              >
                <BlurImage
                  id={post.cover}
                  width={700}
                  height={440}
                  fit="cover"
                  frameClassName="aspect-[16/10] border-b border-fx-line"
                  className="size-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="flex items-center gap-2 text-fx-small text-fx-muted">
                    {post.pinned && (
                      <span className="rounded-full bg-fx-violet-soft px-2 py-0.5 text-fx-label text-fx-violet uppercase">Pinned</span>
                    )}
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </p>
                  <h3 className="text-fx-heading text-fx-ink transition group-hover:text-fx-violet">{post.title}</h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
