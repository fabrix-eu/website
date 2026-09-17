import { useSuspenseQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/PageHeader';
import { Container } from '../../components/Section';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { websitePartnersQueryOptions } from './queries';
import { PartnerRow } from './PartnerRow';

export function PartnersPage() {
  const { data: partners } = useSuspenseQuery(websitePartnersQueryOptions());
  useDocumentTitle('Partners', 'The European consortium running the FABRIX project.');

  return (
    <>
      <PageHeader eyebrow="Consortium" title="Partners">
        <p>
          FABRIX is run by a consortium of {partners.length} European partners led by the Delft University of
          Technology. The working group comprises three leading academic institutions, three SMEs expert in digital
          innovation and development for urban manufacturing, two figures with close connections to the local
          communities in Rotterdam and Athens, and one sector-specific ecosystem builder.
        </p>
      </PageHeader>
      <Container className="grid gap-5 pt-12 md:grid-cols-2">
        {partners.map((partner) => (
          <PartnerRow key={partner.key} partner={partner} />
        ))}
      </Container>
    </>
  );
}
