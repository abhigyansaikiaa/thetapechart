import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alphaedge.example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes
  const routes = [
    '',
    '/analyze',
    '/journal',
    '/screener',
    '/watchlist',
    '/options',
    '/mf',
    '/macro',
    '/learn',
    '/mentor',
    '/tools',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In a real app, you would fetch all stock symbols and blog posts here
  // and append them to the sitemap array.
  const dynamicRoutes = [
    '/tools/position-size',
    '/tools/risk-reward',
    '/tools/sip-returns',
    '/fundamental/RELIANCE',
    '/fundamental/TCS',
    '/blog/understanding-smc-order-blocks',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...dynamicRoutes];
}
