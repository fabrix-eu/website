import { createRootRoute, createRoute, createRouter, notFound, Outlet } from '@tanstack/react-router';
import { queryClient } from './queryClient';
import { ContentLayout } from '../components/layout/ContentLayout';
import { Pending } from '../components/Pending';
import { NotFound } from '../components/NotFound';
import { HomePage } from '../routes/home';
import { AboutPage } from '../routes/about';
import { PlatformPage } from '../routes/platform';
import { ContactPage } from '../routes/contact';
import { newsArticleQueryOptions, newsListQueryOptions } from '../features/news/queries';
import { NewsListPage } from '../features/news/NewsListPage';
import { NewsArticle } from '../features/news/NewsArticle';
import { websitePartnersQueryOptions } from '../features/partners/queries';
import { PartnersPage } from '../features/partners/PartnersPage';
import { cityQueryOptions } from '../features/cities/queries';
import { CityPage } from '../features/cities/CityPage';
import { documentationQueryOptions } from '../features/documentation/queries';
import { DocumentationPage } from '../features/documentation/DocumentationPage';
import { legalPageQueryOptions } from '../features/legal/queries';
import { LegalPage } from '../features/legal/LegalPage';

const rootRoute = createRootRoute({ component: Outlet, notFoundComponent: NotFound });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  loader: () =>
    Promise.all([
      queryClient.ensureQueryData(newsListQueryOptions()),
      queryClient.ensureQueryData(websitePartnersQueryOptions()),
    ]),
  component: HomePage,
});

/** Every page but the home shares the same chrome: the shared header, then the halo and the footer. */
const contentRoute = createRoute({ getParentRoute: () => rootRoute, id: 'content', component: ContentLayout });

// Paths stay literal in each createRoute call: a helper taking `path: string`
// erases them from the router's types, and <Link to="/about"> stops compiling.
const aboutRoute = createRoute({ getParentRoute: () => contentRoute, path: '/about', component: AboutPage });
const platformRoute = createRoute({ getParentRoute: () => contentRoute, path: '/platform', component: PlatformPage });
const contactRoute = createRoute({ getParentRoute: () => contentRoute, path: '/contact', component: ContactPage });

const partnersRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: '/partners',
  loader: () => queryClient.ensureQueryData(websitePartnersQueryOptions()),
  component: PartnersPage,
});

const documentationRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: '/documentation',
  loader: () => queryClient.ensureQueryData(documentationQueryOptions()),
  component: DocumentationPage,
});

const newsRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: '/news',
  loader: () => queryClient.ensureQueryData(newsListQueryOptions()),
  component: NewsListPage,
});

const newsArticleRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: '/news/$slug',
  loader: async ({ params }) => {
    if (!(await queryClient.ensureQueryData(newsArticleQueryOptions(params.slug)))) throw notFound();
  },
  component: function NewsArticleRoute() {
    return <NewsArticle slug={newsArticleRoute.useParams().slug} />;
  },
});

const cityRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: '/cities/$slug',
  loader: async ({ params }) => {
    if (!(await queryClient.ensureQueryData(cityQueryOptions(params.slug)))) throw notFound();
  },
  component: function CityRoute() {
    return <CityPage slug={cityRoute.useParams().slug} />;
  },
});

const legalLoader = (slug: string) => async () => {
  if (!(await queryClient.ensureQueryData(legalPageQueryOptions(slug)))) throw notFound();
};

const privacyRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: '/privacy-policy',
  loader: legalLoader('privacy-policy'),
  component: () => <LegalPage slug="privacy-policy" />,
});

const cookiesRoute = createRoute({
  getParentRoute: () => contentRoute,
  path: '/privacy-policy/cookies',
  loader: legalLoader('cookies-policy'),
  component: () => <LegalPage slug="cookies-policy" />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  contentRoute.addChildren([
    aboutRoute,
    platformRoute,
    contactRoute,
    partnersRoute,
    documentationRoute,
    newsRoute,
    newsArticleRoute,
    cityRoute,
    privacyRoute,
    cookiesRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPendingComponent: Pending,
  defaultNotFoundComponent: NotFound,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
