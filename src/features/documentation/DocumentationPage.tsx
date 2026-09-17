import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowUpRight, Download } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Container, SectionHeading } from '../../components/Section';
import { downloadUrl } from '../../lib/directus';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { documentationQueryOptions } from './queries';

const ZENODO = 'https://zenodo.org/communities/fabrix/records?q=&l=list&p=1&s=10&sort=newest';
const LINK = 'inline-flex items-center gap-1.5 font-bold text-fx-violet hover:underline';

export function DocumentationPage() {
  const { publications, deliverables } = useSuspenseQuery(documentationQueryOptions()).data;
  useDocumentTitle('EU Documentation', 'FABRIX scientific publications and public deliverables to the European Commission.');

  return (
    <>
      <PageHeader title="EU Documentation">
        <p>
          On this page, explore the publications of FABRIX project in depth, from academic publications to the
          deliverables to the European Commission.
        </p>
      </PageHeader>

      <Container className="pt-16">
        <SectionHeading eyebrow="Research" title="Scientific publications" />
        <p className="mb-6 text-fx-lead text-fx-ink2">
          Don’t miss any of our papers:{' '}
          <a href={ZENODO} className={LINK} target="_blank" rel="noreferrer">
            follow FABRIX on Zenodo!
          </a>{' '}
          The following is an up to date list of publications.
        </p>
        <ul className="divide-y divide-fx-line rounded-fx border border-fx-line bg-white">
          {publications.map((p) => (
            <li key={p.id} className="flex flex-col gap-2 p-5 text-fx-body text-fx-ink2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <span>{p.citation}</span>
              <a target="_blank" rel="noreferrer" href={p.url} className={`${LINK} flex-none`}>
                {p.link_label ?? 'Read'}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </Container>

      {deliverables.length > 0 && (
        <Container className="pt-16">
          <SectionHeading eyebrow="European Commission" title="Public deliverables" />
          <ul className="grid gap-4 md:grid-cols-2">
            {deliverables.map((d) => {
              const href = d.file ? downloadUrl(d.file) : d.url;
              const download = Boolean(d.file) || /\.pdf$/i.test(d.url ?? '');
              return (
                <li key={d.id} className="flex flex-col gap-3 rounded-fx border border-fx-line bg-white p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-fx-violet-soft px-2.5 py-1 text-fx-label text-fx-violet uppercase">{d.code}</span>
                    {d.approval && (
                      <span className="rounded-full bg-fx-amber-soft px-2.5 py-1 text-fx-label text-fx-amber uppercase">{d.approval}</span>
                    )}
                  </div>
                  <h3 className="text-fx-heading text-fx-ink">{d.title}</h3>
                  {d.description && <p className="text-fx-body text-fx-ink2">{d.description}</p>}
                  {href && (
                    <a target="_blank" rel="noreferrer" href={href} className={`${LINK} mt-auto border-t border-fx-line pt-3 text-fx-body`}>
                      {download ? <Download className="size-4" aria-hidden /> : <ArrowUpRight className="size-4" aria-hidden />}
                      {download ? 'Download' : 'Open'}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      )}
    </>
  );
}
