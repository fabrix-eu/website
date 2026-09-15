import { Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Carousel } from '../../components/Carousel';
import { BlurImage } from '../../components/BlurImage';
import { websitePartnersQueryOptions } from './queries';

/** "Meet the partners" on the home page: each card links to the partner's entry on /partners. */
export function PartnersCarousel() {
  const { data: partners } = useSuspenseQuery(websitePartnersQueryOptions());

  return (
    <div className="relative z-50 container mx-auto pt-2">
      <div className="mt-16 mb-8 w-20 border-t border-darkblue" />
      <h2 className="pb-8 text-3xl text-darkblue md:pb-12 md:text-6xl">Meet the partners</h2>
      <Carousel gap={48} label="Partners">
        {partners.map((partner) => (
          <Link
            key={partner.key}
            to="/partners"
            hash={partner.key}
            className="inline-flex w-full flex-none snap-start md:w-[calc(33%-2rem)]"
          >
            <div className="relative flex h-64 w-full flex-col items-center justify-between rounded-3xl bg-black">
              <h3 className="block w-full p-4 text-2xl font-bold text-white">{partner.name}</h3>
              <BlurImage
                id={partner.logo_mono ?? partner.logo}
                width={600}
                quality={90}
                blur={false}
                frameClassName="min-h-0 w-full flex-1"
                className="h-full w-full object-contain"
              />
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
}
