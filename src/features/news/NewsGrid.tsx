import { Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { assetUrl } from '../../lib/directus';
import { newsListQueryOptions } from './queries';

/** The News block: all articles on /news, the latest few on the home page. */
export function NewsGrid({ limit }: { limit?: number }) {
  const { data: news } = useSuspenseQuery(newsListQueryOptions());
  const shown = limit ? news.slice(0, limit) : news;

  return (
    <div className="relative z-50 container mx-auto pb-4 md:pb-32">
      <div className="mb-8 w-20 border-t border-darkblue" />
      <h2 className="pb-8 text-3xl text-darkblue md:pb-12 md:text-6xl">News</h2>

      <ul className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {shown.map((post) => (
          <li key={post.id} className="px-2 md:px-0">
            <Link to="/news/$slug" params={{ slug: post.slug }} className="group relative block h-48 w-full md:h-64">
              <img
                src={assetUrl(post.cover, { width: 900, height: 520, fit: 'cover' })}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full rounded-3xl object-cover"
              />
              <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-transparent to-darkblue opacity-70 transition-opacity group-hover:opacity-80" />
              {post.pinned && (
                <span className="absolute top-3 right-3 z-10 rounded-full bg-white px-3 py-1 text-xs font-semibold text-darkblue shadow-lg">
                  Pinned
                </span>
              )}
              <h3 className="absolute right-3 bottom-6 left-3 leading-none text-white">{post.title}</h3>
            </Link>
          </li>
        ))}
      </ul>

      {limit && news.length > limit && (
        <div className="mt-8 text-center">
          <Link
            to="/news"
            className="inline-flex items-center rounded-full bg-darkblue px-6 py-3 text-white transition-colors hover:bg-darkblue/90"
          >
            View all posts
            <ChevronRight className="ml-2 size-4" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
