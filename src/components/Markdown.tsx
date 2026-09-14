import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from '@tanstack/react-router';

/** Markdown fields from Directus (cities, legal pages). Internal links stay in the SPA. */
export function Markdown({ children }: { children: string | null }) {
  if (!children) return null;
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children: label }) =>
          href?.startsWith('/') ? (
            <Link to={href as '/'}>{label}</Link>
          ) : (
            <a href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
