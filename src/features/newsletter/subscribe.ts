import { createItem } from '@directus/sdk';
import { useMutation } from '@tanstack/react-query';
import { directus } from '../../lib/directus';

export interface Subscription {
  email: string;
  first_name: string;
  last_name: string;
}

/** Field-level errors as Directus reports them: `{ errors: [{ message, extensions: { code, field } }] }`. */
export type SubscribeErrors = { fields: Partial<Record<keyof Subscription, string>>; form: string | null };

export function toSubscribeErrors(error: unknown): SubscribeErrors {
  const list = (error as { errors?: { message: string; extensions?: { code?: string; field?: string } }[] })?.errors;
  const fields: SubscribeErrors['fields'] = {};
  let form: string | null = null;
  for (const e of list ?? []) {
    const field = e.extensions?.field as keyof Subscription | undefined;
    if (e.extensions?.code === 'FAILED_VALIDATION' && field) fields[field] = `Please check your ${field.replace('_', ' ')}.`;
    else form = 'Something went wrong. Please try again in a moment.';
  }
  if (!list?.length) form = 'Something went wrong. Please try again in a moment.';
  return { fields, form };
}

/**
 * Writes the sign-up to Directus (public create, no read). A Directus flow
 * forwards it to Brevo, where the Brevo key stays — never in this bundle.
 */
export function useSubscribe() {
  return useMutation({
    mutationFn: (payload: Subscription) => directus.request(createItem('newsletter_subscriptions', payload)),
  });
}
