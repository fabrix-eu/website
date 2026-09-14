import { useMemo, type MouseEvent } from 'react';
import DOMPurify from 'dompurify';
import { useRouter } from '@tanstack/react-router';

// Editors embed YouTube / Vimeo players; keep iframes, but only over https.
DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (data.tagName === 'iframe' && !(node as Element).getAttribute('src')?.startsWith('https://')) {
    node.parentNode?.removeChild(node);
  }
});

const OPTIONS = { ADD_TAGS: ['iframe'], ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target'] };

/**
 * News bodies are editor HTML from Directus. Sanitised, then rendered as-is:
 * styling comes from `prose` on the container, not classes on the markup.
 * Internal links (`/documentation`, `/#newsletter`) go through the router
 * instead of reloading the page.
 */
export function RichHtml({ html, className }: { html: string | null; className?: string }) {
  const router = useRouter();
  const clean = useMemo(() => (html ? DOMPurify.sanitize(html, OPTIONS) : ''), [html]);
  if (!clean) return null;

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as Element).closest('a');
    const href = anchor?.getAttribute('href');
    if (!href?.startsWith('/') || anchor?.target === '_blank' || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    router.navigate({ href });
  };

  return <div className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: clean }} />;
}
