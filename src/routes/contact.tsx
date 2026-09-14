import { PageCard } from '../components/PageCard';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function ContactPage() {
  useDocumentTitle('Contact', 'Who to contact about the FABRIX project.');

  return (
    <PageCard title="Contact" className="min-h-screen">
      <p className="prose mt-4 text-darkblue">For information about the FABRIX project, you may contact:</p>
      <address className="prose mt-4 text-darkblue not-italic">
        <strong>Project and Scientific lead:</strong>
        <br />
        Dr. K.B.J. (Karel) Van den Berghe
        <br />
        Assistant Professor in Spatial Planning and Urban Development Management | TU Delft
        <br />
        <a href="mailto:K.B.J.VandenBerghe@tudelft.nl">K.B.J.VandenBerghe@tudelft.nl</a>
      </address>
      <address className="prose mt-4 text-darkblue not-italic">
        <strong>Project manager for general information:</strong>
        <br />
        Eva Kassotaki
        <br />
        TU Delft | Innovation &amp; Impact Centre
        <br />
        <a href="mailto:E.Kassotaki@tudelft.nl">E.Kassotaki@tudelft.nl</a>
      </address>
    </PageCard>
  );
}
