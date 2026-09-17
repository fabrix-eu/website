import type { ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Markdown } from '../../components/Markdown';
import { BlurImage } from '../../components/BlurImage';
import { PageHeader } from '../../components/PageHeader';
import { Container, Eyebrow } from '../../components/Section';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { cityQueryOptions } from './queries';

const PROSE = 'prose max-w-none prose-p:text-fx-lead prose-li:text-fx-lead';

/** Title on one side (sticky under the header), Markdown on the other. */
function Split({ title, children, flip = false }: { title: string | null; children: ReactNode; flip?: boolean }) {
  return (
    <section className="grid gap-6 border-t border-fx-line py-14 first:border-t-0 lg:grid-cols-12 lg:gap-12">
      <div className={flip ? 'lg:order-2 lg:col-span-5' : 'lg:col-span-5'}>
        <h2 className="text-fx-title text-fx-ink sm:text-fx-display lg:sticky lg:top-[calc(var(--spacing-topbar)+2rem)]">
          {title}
        </h2>
      </div>
      <div className={`${PROSE} lg:col-span-7`}>{children}</div>
    </section>
  );
}

export function CityPage({ slug }: { slug: string }) {
  const city = useSuspenseQuery(cityQueryOptions(slug)).data!;
  useDocumentTitle(city.name, city.intro ?? undefined);

  return (
    <>
      <PageHeader eyebrow="City" title={city.name}>
        {city.intro && <p>{city.intro}</p>}
      </PageHeader>

      {city.cover && (
        <Container className="pt-6">
          <BlurImage
            id={city.cover.id}
            width={2400}
            quality={85}
            dims={city.cover}
            loading="eager"
            frameClassName="w-full rounded-fx-xl"
            className="h-auto w-full"
          />
        </Container>
      )}

      {/*
        `cities.background` is not rendered: on the old site its band had
        no height (`h-100` did not exist in Tailwind v3), so visitors never
        saw it. Showing it would change the page — a design decision, not a
        port. The field stays in Directus for when that decision is made.
      */}
      <Container className="pt-6">
        <Split title={city.about_title}>
          <Markdown>{city.about}</Markdown>
        </Split>
        <Split title="The Stakeholders" flip>
          <Markdown>{city.stakeholders}</Markdown>
        </Split>

        <section className="mt-6 rounded-fx-xl border border-fx-line bg-fx-panel p-6 sm:p-12">
          <div className="max-w-3xl">
            <Eyebrow>Get in touch</Eyebrow>
            <h2 className="text-fx-title text-fx-ink sm:text-fx-display">Contact Partners in {city.name}</h2>
            <div className={`${PROSE} mt-4`}>
              <Markdown>{city.contact_intro}</Markdown>
            </div>
          </div>
          <div className={`${PROSE} mt-8 rounded-fx border border-fx-line bg-white p-6 sm:p-10`}>
            <Markdown>{city.contacts}</Markdown>
          </div>
        </section>
      </Container>
    </>
  );
}
