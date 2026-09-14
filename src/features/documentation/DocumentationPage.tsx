import { useSuspenseQuery } from '@tanstack/react-query';
import { PageCard } from '../../components/PageCard';
import { downloadUrl } from '../../lib/directus';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { documentationQueryOptions } from './queries';

const LINK = 'text-blue-600 underline';
const CELL = 'h-24 border border-black p-2 align-top';

export function DocumentationPage() {
  const { publications, deliverables } = useSuspenseQuery(documentationQueryOptions()).data;
  useDocumentTitle('EU Documentation', 'FABRIX scientific publications and public deliverables to the European Commission.');

  return (
    <PageCard title="EU Documentation">
      <p className="text-darkblue md:w-5/6">
        On this page, explore the publications of FABRIX project in depth, from academic publications to the
        deliverables to the European Commission.
      </p>

      <h2 className="my-6 mt-12 text-xl font-bold text-darkblue">Scientific Publications</h2>
      <p className="mb-6 text-darkblue">
        Don’t miss any of our papers:{' '}
        <a href="https://zenodo.org/communities/fabrix/records?q=&l=list&p=1&s=10&sort=newest" className={LINK} target="_blank" rel="noreferrer">
          follow FABRIX on Zenodo!
        </a>{' '}
        The following is an up to date list of publications.
      </p>
      <ul className="pl-4">
        {publications.map((p) => (
          <li key={p.id} className="mb-6 ml-4 list-disc pl-4 text-darkblue">
            {p.citation}. [
            <a target="_blank" rel="noreferrer" href={p.url} className={LINK}>
              {p.link_label ?? 'Read'}
            </a>
            ]
          </li>
        ))}
      </ul>

      <h2 className="my-6 mt-12 text-xl font-bold text-darkblue">Public Deliverables</h2>
      {deliverables.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm text-darkblue">
            <tbody>
              {deliverables.map((d) => {
                const href = d.file ? downloadUrl(d.file) : d.url;
                return (
                  <tr key={d.id}>
                    <td className={CELL}>
                      <div className="flex h-full flex-col justify-between gap-2">
                        <span>{d.code}</span>
                        {href && (
                          <a target="_blank" rel="noreferrer" href={href} className={LINK}>
                            LINK
                          </a>
                        )}
                      </div>
                    </td>
                    <td className={CELL}>
                      <div className="flex h-full flex-col justify-between gap-2">
                        <span>{d.title}</span>
                        {d.approval && <span>*STATUS : {d.approval}</span>}
                      </div>
                    </td>
                    <td className={CELL}>{d.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PageCard>
  );
}
