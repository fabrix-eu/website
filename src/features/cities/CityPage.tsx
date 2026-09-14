import { useSuspenseQuery } from '@tanstack/react-query';
import { Markdown } from '../../components/Markdown';
import { assetUrl } from '../../lib/directus';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { cityQueryOptions } from './queries';

const PROSE = 'font-plex prose prose-lg prose-gray max-w-none leading-relaxed text-gray-700';
const RULE = 'mb-6 h-0.5 w-16 bg-linear-to-r from-purple-500 to-pink-500';
const HEADING = 'text-4xl font-bold text-gray-900 lg:text-5xl';

export function CityPage({ slug }: { slug: string }) {
  const city = useSuspenseQuery(cityQueryOptions(slug)).data!;
  useDocumentTitle(city.name, city.intro ?? undefined);

  return (
    <div className="min-h-screen">
      <section className="relative px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto mb-6 max-w-6xl">
          <div className="mb-4 h-0.5 w-16 bg-darkblue/60" />
          <h1 className="mb-6 text-5xl font-bold text-darkblue lg:text-7xl">{city.name}</h1>
          <p className="font-plex max-w-4xl text-xl leading-relaxed text-darkblue/90 lg:text-2xl">{city.intro}</p>
        </div>
      </section>

      {city.cover && (
        <div className="relative z-20 -mt-16 px-6 lg:px-12">
          <img
            src={assetUrl(city.cover, { width: 2400, quality: 85 })}
            alt=""
            className="mx-auto h-auto w-full max-w-6xl rounded-3xl object-cover"
          />
        </div>
      )}

      <div className="bg-linear-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-12">
          <section className="mb-32 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                <div className={RULE} />
                <h2 className={`${HEADING} mb-8`}>{city.about_title}</h2>
              </div>
            </div>
            <div className={`${PROSE} lg:col-span-7`}>
              <Markdown>{city.about}</Markdown>
            </div>
          </section>

          {/*
            `cities.background` is not rendered: on the old site its band had
            no height (`h-100` did not exist in Tailwind v3), so visitors never
            saw it. Showing it would change the page — a design decision, not a
            port. The field stays in Directus for when that decision is made.
          */}

          <section className="mb-32 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className={`${PROSE} lg:col-span-7 lg:col-start-1`}>
              <Markdown>{city.stakeholders}</Markdown>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="sticky top-8">
                <div className={RULE} />
                <h2 className={HEADING}>The Stakeholders</h2>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-purple-100 via-pink-50 to-purple-50" />
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="mb-16 text-center">
                <div className={`${RULE} mx-auto`} />
                <h2 className={`${HEADING} mb-6`}>Contact Partners in {city.name}</h2>
                <div className="font-plex mx-auto max-w-3xl text-lg leading-relaxed text-gray-700">
                  <Markdown>{city.contact_intro}</Markdown>
                </div>
              </div>
              <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg lg:p-12">
                <div className={PROSE}>
                  <Markdown>{city.contacts}</Markdown>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="h-32 bg-linear-to-b from-white to-purple-50" />
    </div>
  );
}
