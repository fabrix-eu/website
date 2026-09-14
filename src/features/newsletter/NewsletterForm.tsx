import type { FormEvent, ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { toSubscribeErrors, useSubscribe } from './subscribe';

const INPUT = 'block w-full rounded-lg border border-gray-300 bg-gray-300 p-4 text-sm text-darkblue shadow-xs placeholder:text-darkblue';

function FieldError({ children }: { children?: string }) {
  return children ? <p className="mt-1 text-sm text-red-600">{children}</p> : null;
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div id="newsletter" className="relative z-40 container mx-auto scroll-mt-8 rounded-3xl bg-white px-4 py-12 md:px-24">
      <h2 className="text-xl text-darkblue md:text-2xl">Newsletter</h2>
      <div className="my-8 w-20 border-t border-darkblue" />
      <p className="w-full text-2xl text-pretty text-darkblue md:w-3/4 md:text-4xl">
        Stay on top of the latest project news and opportunities with the Fabrix Newsletter
      </p>
      {children}
    </div>
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
        <p role="status" className="mt-8 ml-8 text-green-600">
          You have been registered on our newsletter!
        </p>
      </Panel>
    );
  }

  return (
    <Panel>
      <form onSubmit={onSubmit} className="mt-8 max-w-lg p-4 md:ml-8">
        {errors?.form && (
          <p role="alert" className="mb-4 text-red-600">
            {errors.form}
          </p>
        )}
        <div className="mb-4 flex w-full gap-2">
          <div className="w-2/3">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="Enter your email address" className={INPUT} />
            <FieldError>{errors?.fields.email}</FieldError>
          </div>
          <button
            type="submit"
            disabled={subscribe.isPending}
            className="w-1/3 rounded-lg border border-darkblue bg-darkblue px-4 py-4 text-sm text-white disabled:opacity-60 md:px-8"
          >
            {subscribe.isPending ? 'Sending…' : 'Subscribe'}
          </button>
        </div>
        <div className="mb-4 flex gap-2">
          <div className="w-1/2">
            <label htmlFor="first_name" className="sr-only">First name</label>
            <input id="first_name" name="first_name" required autoComplete="given-name" placeholder="First name" className={INPUT} />
            <FieldError>{errors?.fields.first_name}</FieldError>
          </div>
          <div className="w-1/2">
            <label htmlFor="last_name" className="sr-only">Last name</label>
            <input id="last_name" name="last_name" required autoComplete="family-name" placeholder="Last name" className={INPUT} />
            <FieldError>{errors?.fields.last_name}</FieldError>
          </div>
        </div>
        <label className="inline-flex items-center">
          <input type="checkbox" name="accept_privacy" required className="size-5 rounded-sm border-gray-300 text-darkblue focus:ring-darkblue/30" />
          <span className="ml-2 text-sm text-gray-700">
            I accept the&nbsp;
            <Link to="/privacy-policy" target="_blank" className="font-bold underline">
              privacy policy
            </Link>
          </span>
        </label>
      </form>
    </Panel>
  );
}
