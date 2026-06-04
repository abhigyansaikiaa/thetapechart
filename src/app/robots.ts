import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://alphaedge.example.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/private/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
