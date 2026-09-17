import type { FormEvent, ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { BUTTON, Container, Eyebrow } from '../../components/Section';
import { toSubscribeErrors, useSubscribe } from './subscribe';

const INPUT =
  'block w-full rounded-fx-action border border-fx-line2 bg-white px-4 py-3 text-fx-body text-fx-ink transition placeholder:text-fx-muted focus:border-fx-violet-border focus:ring-2 focus:ring-fx-violet-soft focus:outline-hidden';

function FieldError({ children }: { children?: string }) {
  return children ? <p className="mt-1 text-fx-small text-fx-rose">{children}</p> : null;
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <Container>
      <div
        id="newsletter"
        className="grid scroll-mt-[calc(var(--spacing-topbar)+1rem)] gap-8 rounded-fx-xl border border-fx-line bg-white p-6 sm:p-12 lg:grid-cols-2 lg:gap-12"
      >
        <div>
          <Eyebrow>Newsletter</Eyebrow>
          <h2 className="text-fx-title text-fx-ink sm:text-fx-display">Stay on top of the latest project news and opportunities</h2>
        </div>
        <div className="self-center">{children}</div>
      </div>
    </Container>
  );
}

/** Uncontrolled + FormData; Directus validates, its errors land next to the field. */
export function NewsletterForm() {
  const subscribe = useSubscribe();
  const errors = subscribe.error ? toSubscribeErrors(subscribe.error) : null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    subscribe.mutate({
      email: String(fd.get('email') ?? '').trim(),
      first_name: String(fd.get('first_name') ?? '').trim(),
      last_name: String(fd.get('last_name') ?? '').trim(),
    });
  };

  if (subscribe.isSuccess) {
    return (
      <Panel>
        <p role="status" className="inline-flex rounded-fx-action bg-fx-green-soft px-4 py-3 text-fx-body font-bold text-fx-green">
          You have been registered on our newsletter!
        </p>
      </Panel>
    );
  }

  return (
    <Panel>
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        {errors?.form && (
          <p role="alert" className="text-fx-body text-fx-rose sm:col-span-2">
            {errors.form}
          </p>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="email" className="sr-only">Email address</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="Email address" className={INPUT} />
          <FieldError>{errors?.fields.email}</FieldError>
        </div>
        <div>
          <label htmlFor="first_name" className="sr-only">First name</label>
          <input id="first_name" name="first_name" required autoComplete="given-name" placeholder="First name" className={INPUT} />
          <FieldError>{errors?.fields.first_name}</FieldError>
        </div>
        <div>
          <label htmlFor="last_name" className="sr-only">Last name</label>
          <input id="last_name" name="last_name" required autoComplete="family-name" placeholder="Last name" className={INPUT} />
          <FieldError>{errors?.fields.last_name}</FieldError>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
          <label className="inline-flex items-center gap-2 text-fx-body text-fx-ink2">
            <input type="checkbox" name="accept_privacy" required className="size-4.5 rounded-[5px] border-fx-line2 text-fx-violet focus:ring-fx-violet-soft" />
            <span>
              I accept the{' '}
              <Link to="/privacy-policy" target="_blank" className="font-bold text-fx-ink underline underline-offset-3">
                privacy policy
              </Link>
            </span>
          </label>
          <button type="submit" disabled={subscribe.isPending} className={BUTTON}>
            {subscribe.isPending ? 'Sending…' : 'Subscribe'}
          </button>
        </div>
      </form>
    </Panel>
  );
}
