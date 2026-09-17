import { Mail } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Container } from '../components/Section';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const CONTACTS = [
  {
    role: 'Project and scientific lead',
    name: 'Dr. K.B.J. (Karel) Van den Berghe',
    affiliation: 'Assistant Professor in Spatial Planning and Urban Development Management | TU Delft',
    email: 'K.B.J.VandenBerghe@tudelft.nl',
  },
  {
    role: 'Project manager for general information',
    name: 'Eva Kassotaki',
    affiliation: 'TU Delft | Innovation & Impact Centre',
    email: 'E.Kassotaki@tudelft.nl',
  },
];

export function ContactPage() {
  useDocumentTitle('Contact', 'Who to contact about the FABRIX project.');

  return (
    <>
      <PageHeader title="Contact">
        <p>For information about the FABRIX project, you may contact:</p>
      </PageHeader>

      <Container className="grid gap-5 pt-12 md:grid-cols-2">
        {CONTACTS.map((contact) => (
          <address key={contact.email} className="flex flex-col rounded-fx border border-fx-line bg-white p-6 not-italic">
            <span className="text-fx-label text-fx-violet uppercase">{contact.role}</span>
            <strong className="mt-3 text-fx-heading text-fx-ink">{contact.name}</strong>
            <span className="mt-1 text-fx-body text-fx-ink2">{contact.affiliation}</span>
            <a
              href={`mailto:${contact.email}`}
              className="mt-5 inline-flex items-center gap-2 border-t border-fx-line pt-4 text-fx-body font-bold text-fx-violet hover:underline"
            >
              <Mail className="size-4" aria-hidden />
              {contact.email}
            </a>
          </address>
        ))}
      </Container>
    </>
  );
}
