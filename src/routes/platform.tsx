import { PageCard } from '../components/PageCard';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const P = 'mb-4 text-darkblue md:w-5/6';

export function PlatformPage() {
  useDocumentTitle('Platform', 'Digital tools to enhance local stakeholders’ capacity to manage and improve value chains.');

  return (
    <PageCard title="PLATFORM">
      <p className={P}>
        The FABRIX project seeks to encourage urban manufacturing that is local, innovative, economically positive,
        socially inclusive, and circular, focusing on the textile, clothing and fashion industry. Central to these goals
        is the use of an online platform.
      </p>
      <p className={P}>
        The platform produced as part of FABRIX’s activities will be a suite of digital tools that enhance local
        stakeholders’ capacity to manage and improve value chains.
      </p>
      <p className={P}>
        We have observed that it is very challenging for planning professionals who deal with a range of network types,
        such as economic, resource flow and spatial planning, to have constructive exchanges regardless of the overlap of
        these disciplines and worldviews.
      </p>
      <p className={P}>
        With the right data, a platform could help overcome this barrier to envisage and analyse spatial and relational
        networks and find opportunities for development. As we approach the end of the project’s first year, we have
        confirmed that a tool is needed to facilitate local production networks, particularly to address circular economy
        and spatial planning. We’ve interviewed businesses, public authorities and other stakeholders and we’ve analysed
        the many existing tools for production and the circular economy.
      </p>
      <p className={P}>
        Currently, project partners are considering a range of functionalities to integrate into the platform. These will
        be validated or excluded as well as tested through a participatory process that will engage both “facilitators”
        and what we call “value chain actors” who are the multiplicity of businesses that make up this industry. What to
        expect in the near future from FABRIX:
      </p>
      <ul className="pl-4 text-darkblue">
        <li className="ml-4 list-disc py-2">Additional stakeholder events, interviews and testing phases</li>
        <li className="ml-4 list-disc py-2">An open call to identify “facilitators” in Athens and Rotterdam (December 2024)</li>
        <li className="ml-4 list-disc py-2">An open call for businesses (SMEs) to engage in the platform and ecosystem (April 2025)</li>
      </ul>
    </PageCard>
  );
}
