import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { SURFACES } from './navLinks';
import { SocialLinks } from './social';

/**
 * The shared FABRIX footer: wordmark and social links, the EU funding
 * statement, then the three surfaces, Contact and the policies — the set the
 * menu spec (Platform landing page_Sept2026) asks every surface to carry.
 * The EU emblem and the disclaimer are reviewed by the project officer: do not
 * shorten the disclaimer or drop either logo.
 */
export function Footer() {
  return (
    <div className="relative mx-auto max-w-6xl px-5">
      <hr className="mt-12 mb-10 border-t border-white/60" />

      <div className="mb-10 flex w-full flex-wrap items-center justify-between gap-y-4">
        <div className="flex items-center md:w-1/3">
          <img src="/images/flag-of-europe.svg" alt="Flag of Europe" className="h-16 w-24 rounded-[3px] border-2 border-white" />
          <p className="ml-4 text-fx-heading text-fx-ink">
            Funded by <br />
            the European Union
          </p>
        </div>
        <p className="text-fx-small text-fx-ink md:w-2/5">
          FABRIX has received funding from the European Union’s Horizon Europe Programme, under grant agreement No.
          101135638. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect
          those of the European Union or HaDEA. Neither the European Union nor the granting authority can be held
          responsible for them.
        </p>
        <div className="flex items-center justify-end md:w-1/4">
          <a target="_blank" href="https://www.ecosystex.eu/" rel="noreferrer">
            <img src="/images/ecosystex-logo.png" alt="Ecosystex" width={200} height={85} loading="lazy" />
          </a>
        </div>
      </div>

      <div className="mb-8 w-full rounded-fx-lg border border-fx-line bg-white px-6 py-7 md:px-10">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <Link to="/" className="flex flex-none items-center" aria-label="FABRIX home">
            <img src="/fabrix-logo.svg" alt="FABRIX" className="h-6 w-auto" />
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-fx-body" aria-label="FABRIX">
            {SURFACES.map((surface) =>
              surface.href ? (
                <a
                  key={surface.label}
                  href={surface.href}
                  className="flex items-center gap-1 text-fx-ink2 transition hover:text-fx-ink"
                >
                  {surface.label}
                  <ArrowUpRight className="size-3.5 text-fx-muted" aria-hidden />
                </a>
              ) : (
                <Link key={surface.label} to="/" className="font-bold text-fx-ink">
                  {surface.label}
                </Link>
              ),
            )}
            <Link to="/contact" className="text-fx-ink2 transition hover:text-fx-ink">
              Contact
            </Link>
          </nav>

          <SocialLinks
            className="ml-auto"
            linkClassName="flex rounded-fx-sm border border-fx-line p-2 text-fx-ink2 transition hover:border-fx-violet-border hover:text-fx-violet"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-fx-line pt-5 text-fx-small text-fx-muted">
          <Link to="/privacy-policy" className="transition hover:text-fx-ink">
            Privacy policy
          </Link>
          <Link to="/privacy-policy/cookies" className="transition hover:text-fx-ink">
            Cookies policy
          </Link>
        </div>
      </div>
    </div>
  );
}
