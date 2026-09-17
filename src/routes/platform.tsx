import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { BUTTON, Container } from '../components/Section';
import { PLATFORM_URL } from '../lib/directus';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function PlatformPage() {
  useDocumentTitle('Platform', 'Digital tools to enhance local stakeholders’ capacity to manage and improve value chains.');

  return (
    <>
      <PageHeader title="Platform">
        <p>
          The FABRIX project seeks to encourage urban manufacturing that is local, innovative, economically positive,
          socially inclusive, and circular, focusing on the textile, clothing and fashion industry. Central to these goals
          is the use of an online platform.
        </p>
        <p>
          <a href={PLATFORM_URL} className={`${BUTTON} mt-3`}>
            Go to the platform
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </p>
      </PageHeader>

      <Container className="pt-14">
        <div className="prose max-w-3xl prose-p:text-fx-lead prose-li:text-fx-lead">
          <p>
            The platform produced as part of FABRIX’s activities will be a suite of digital tools that enhance local
            stakeholders’ capacity to manage and improve value chains.
          </p>
          <p>
            We have observed that it is very challenging for planning professionals who deal with a range of network
            types, such as economic, resource flow and spatial planning, to have constructive exchanges regardless of the
            overlap of these disciplines and worldviews.
          </p>
          <p>
            With the right data, a platform could help overcome this barrier to envisage and analyse spatial and
            relational networks and find opportunities for development. As we approach the end of the project’s first
            year, we have confirmed that a tool is needed to facilitate local production networks, particularly to address
            circular economy and spatial planning. We’ve interviewed businesses, public authorities and other stakeholders
            and we’ve analysed the many existing tools for production and the circular economy.
          </p>
          <p>
            Currently, project partners are considering a range of functionalities to integrate into the platform. These
            will be validated or excluded as well as tested through a participatory process that will engage both
            “facilitators” and what we call “value chain actors” who are the multiplicity of businesses that make up this
            industry. What to expect in the near future from FABRIX:
          </p>
          <ul>
            <li>Additional stakeholder events, interviews and testing phases</li>
            <li>An open call to identify “facilitators” in Athens and Rotterdam (December 2024)</li>
            <li>An open call for businesses (SMEs) to engage in the platform and ecosystem (April 2025)</li>
          </ul>
        </div>
      </Container>
    </>
  );
}
