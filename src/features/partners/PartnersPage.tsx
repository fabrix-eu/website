import { useSuspenseQuery } from '@tanstack/react-query';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { websitePartnersQueryOptions } from './queries';
import { PartnerRow } from './PartnerRow';

export function PartnersPage() {
  const { data: partners } = useSuspenseQuery(websitePartnersQueryOptions());
  useDocumentTitle('Partners', 'The European consortium running the FABRIX project.');

  return (
    <div className="my-24 min-h-screen rounded-3xl bg-white">
      <div className="mx-8 py-24 lg:mx-auto lg:w-2/3">
        <div className="mb-2 w-16 border-t border-darkblue" />
        <h1 className="pb-4 text-3xl text-darkblue md:pb-8 md:text-4xl">Partners</h1>
        <p className="mb-8 text-lg leading-normal text-darkblue">
          FABRIX is run by a consortium of {partners.length} European partners led by the Delft University of
          Technology. The working group comprises three leading academic institutions, three SMEs expert in digital
          innovation and development for urban manufacturing, two figures with close connections to the local
          communities in Rotterdam and Athens, and one sector-specific ecosystem builder.
        </p>
        {partners.map((partner, index) => (
          <PartnerRow key={partner.key} partner={partner} index={index} />
        ))}
      </div>
    </div>
  );
}
