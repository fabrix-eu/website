import { Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Carousel } from '../../components/Carousel';
import { BlurImage } from '../../components/BlurImage';
import { Container, SectionHeading, TEXT_LINK } from '../../components/Section';
import { websitePartnersQueryOptions } from './queries';

/** "Meet the partners" on the home page: each card links to the partner's entry on /partners. */
export function PartnersCarousel() {
  const { data: partners } = useSuspenseQuery(websitePartnersQueryOptions());

  return (
    <Container className="pt-20">
      <SectionHeading
        eyebrow="Consortium"
        title="Meet the partners"
        action={
          <Link to="/partners" className={TEXT_LINK}>
            All partners
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <Carousel gap={20} label="Partners">
        {partners.map((partner) => (
          <Link
            key={partner.key}
            to="/partners"
            hash={partner.key}
            className="group flex h-56 w-[80%] flex-none snap-start flex-col rounded-fx border border-fx-line bg-white p-5 transition hover:border-fx-line2 hover:shadow-[0_8px_24px_-14px_rgba(26,26,34,0.25)] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
          >
            <BlurImage
              id={partner.logo}
              width={500}
              quality={90}
              blur={false}
              frameClassName="flex min-h-0 w-full flex-1 items-center justify-center"
              className="max-h-24 w-auto max-w-full object-contain"
            />
            <h3 className="mt-4 border-t border-fx-line pt-3 text-fx-body font-bold text-fx-ink group-hover:text-fx-violet">
              {partner.name}
            </h3>
          </Link>
        ))}
      </Carousel>
    </Container>
  );
}
