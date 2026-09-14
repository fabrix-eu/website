import { Link } from '@tanstack/react-router';

const SOCIAL = [
  { name: 'LinkedIn', icon: '/icons/linkedin.png', url: 'https://www.linkedin.com/company/101634457/' },
  { name: 'Instagram', icon: '/icons/instagram.png', url: 'https://www.instagram.com/fabrixproject/' },
];

export function Footer() {
  return (
    <div className="relative z-30 container mx-auto">
      <hr className="mt-24 mb-12 border-t border-darkblue" />
      <div className="mb-12 flex w-full flex-wrap items-center justify-between md:px-2">
        <div className="flex items-center px-4 md:w-1/3 md:px-0">
          <img src="/images/flag-of-europe.svg" alt="Flag of Europe" className="h-20 w-32 border-2 border-white" />
          <p className="ml-4 text-xl font-bold text-darkblue md:text-white">
            Funded by <br />
            the European Union
          </p>
        </div>
        <p className="p-4 text-xs text-darkblue md:w-2/5">
          FABRIX has received funding from the European Union’s Horizon Europe Programme, under grant agreement No.
          101135638. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect
          those of the European Union or HaDEA. Neither the European Union nor the granting authority can be held
          responsible for them.
        </p>
        <div className="flex items-center justify-end px-4 md:w-1/4 md:px-0">
          <a target="_blank" href="https://www.ecosystex.eu/" rel="noreferrer">
            <img src="/images/ecosystex-logo.png" alt="Ecosystex" width={200} height={85} loading="lazy" />
          </a>
        </div>
      </div>

      <div className="mb-12 flex w-full rounded-md bg-white py-6 pr-12 pl-4 md:pl-24">
        <ul className="w-1/2">
          <li className="py-2">
            <Link to="/privacy-policy" className="text-darkblue">
              Privacy policy
            </Link>
          </li>
          <li className="py-2">
            <Link to="/privacy-policy/cookies" className="text-darkblue">
              Cookies policy
            </Link>
          </li>
        </ul>
        <ul className="flex w-1/2 items-center justify-end gap-2">
          {SOCIAL.map((s) => (
            <li key={s.name}>
              <a href={s.url} target="_blank" rel="noreferrer" aria-label={`FABRIX on ${s.name}`}>
                <img src={s.icon} alt="" width={48} height={48} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
