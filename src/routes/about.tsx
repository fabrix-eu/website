import type { ReactNode } from 'react';
import { PageHeader } from '../components/PageHeader';
import { BUTTON } from '../components/Section';
import { PLATFORM_URL } from '../lib/directus';
import { useDocumentTitle } from '../lib/useDocumentTitle';

/** Heading on the left, text on the right, stacked on mobile; a hairline between sections. */
function Split({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-fx-line py-14 first:border-t-0 md:grid-cols-[1fr_1.5fr] md:gap-12">
      <h2 className="text-fx-title text-fx-ink sm:text-fx-display">{title}</h2>
      <div className="prose max-w-none prose-p:text-fx-lead">{children}</div>
    </section>
  );
}

export function AboutPage() {
  useDocumentTitle('About', 'FABRIX is a Horizon Europe project fostering regenerative textile and clothing ecosystems in Rotterdam and Athens.');

  return (
    <>
      <PageHeader eyebrow="About" title="About FABRIX">
        <p>FABRIX is a Horizon Europe project running from January 2024 to December 2026.</p>
        <p>
          FABRIX refers to “Fostering local, beautiful, and sustainably designed regenerative textile and clothing
          ecosystems”. Read below to find out why, where and how we plan on achieving this.
        </p>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-5 pt-6">
        <Split title="Our Vision">
          <p>
            Imagine a future in which textiles and clothing (T&C) are manufactured and consumed as locally as possible,
            in beautiful, sustainable urban environments, close to home and close to where people want to live. A
            moment, not long from now, in which fast fashion is out of fashion, where pre- and post-consumer textile
            waste is actually a resource, where companies openly share resources, data and innovation to reach common
            sustainable goals. A time and place that embraces diversity and gender equity, where local heritages and
            craftspersonship are preserved and valued. What will it look like when productive systems are beautiful,
            designed to be circular, innovative, adaptive, just, and regenerative?
          </p>
        </Split>
        <Split title="Why change is imperative">
          <p>
            The textile and clothing sector is one of the EU’s most innovative and economically important sectors just
            as much as its an environmental disaster. The European Green Deal, the Circular Economy Action Plan, and the
            Industrial Strategy have identified the T&C sector as a priority sector to pave the way towards a carbon
            neutral, circular economy, and a key product value chain with an urgent need and a strong potential for the
            transition to sustainable and circular production and consumption, including new business models (source).
          </p>
          <p>
            Many cities in Europe are starting to realize the importance of bringing manufacturing back to urban areas,
            but at the same time struggle with the planning and designing of these in or near their cities. This
            struggle arrives from the difficulty of these functions to be spatially mixed with residential and
            commercial functions, because of land price mechanisms, but also following effective processes. There is an
            urgent need to find spatial planning and design tools and ideas to cope with this challenge.
          </p>
          <p>
            What can be done? While the micro and small to medium enterprises of the T&C sector focus on reducing
            environmental impact of their processes or on innovative (or traditional) recycling processes, what is
            lacking is an overall or systemic view that can only be developed through mapping and collaboration. Add to
            this how years of the linear economic model have caused much of manufacturing to move out of urban areas or
            directly out of the country and continent, leading to shortages of skills and a lack of local, small-scale
            production.
          </p>
        </Split>

        <section className="my-6 grid overflow-hidden rounded-fx-xl bg-cities-map lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4 p-6 text-fx-lead text-fx-ink2 sm:p-12">
            <h2 className="mb-2 text-fx-title text-fx-ink sm:text-fx-display">How we will lead change</h2>
            <p>
              FABRIX asks if it is possible for a digital platform or series of tools to help unite and rebuild an
              industry like T&C while at the same time facilitate the development of spatial urban areas in a way that
              would include a more localized and socially inclusive regenerative and innovative manufacturing sector.
            </p>
            <p>
              This EU-funded project takes two very different cities as case studies: Rotterdam in the Netherlands and
              Athens in Greece. Working with representatives from the many aspects that make up the textile and clothing
              industry, from student designers to established textile producers and everyone in between, we’ll define
              needs, build community, and combine services in an innovative and interactive platform that will support a
              more local, circular, regenerative and ethical manufacturing and consumption process.
            </p>
            <p>
              Our approach encompasses fostering a network of cooperation among designers, manufacturers, policymakers, and
              educational institutions. By promoting circular business models, supporting the development of sustainable
              materials, and advocating for ethical practices, we aim to catalyze a comprehensive transformation of the T&C
              sector in Athens and Rotterdam. The tools and methods will be available to other cities and industries to use
              and adapt to their context.
            </p>
          </div>
          <img
            src="/images/2_cities_background.webp"
            alt="Map of Europe marking Rotterdam and Athens"
            loading="lazy"
            className="h-72 w-full object-cover object-[50%_30%] lg:h-full"
          />
        </section>

        <Split title="The platform">
          <p>
            The platform produced as part of FABRIX’s activities will be a suite of digital tools that enhance local
            stakeholders’ capacity to manage and improve value chains.
          </p>
          <p>
            We have observed that it is very challenging for planning professionals who deal with a range of network
            types, such as economic, resource flow and spatial planning, to have constructive exchanges regardless of
            the overlap of these disciplines and worldviews.
          </p>
          <p>
            In Fall 2025, the platform is in Beta mode (access at{' '}
            <a href="https://platform.fabrixproject.eu" target="_blank" rel="noreferrer">platform.fabrixproject.eu</a>)
            and its functionalities are being validated by the Facilitators and organisations who are recipients of our
            two open calls. If you are interested in getting involved in Rotterdam or Athens, feel free to sign up and
            join us!
          </p>
          <p>
            In the future, partners will explore transfer methodologies so that other urban areas can benefit from the
            platform and resources developed during this project.
          </p>
          <p className="not-prose">
            <a href={PLATFORM_URL} className={BUTTON}>
              Go to the platform
            </a>
          </p>
        </Split>
      </div>
    </>
  );
}
