/**
 * @file SEOHead.tsx
 * @description Reusable SEO component for meta tags, OpenGraph, Twitter Cards, and structured data
 */
import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: Record<string, unknown>;
}

const SITE_NAME = 'Alawein Platform';
const DEFAULT_DESCRIPTION =
  'Unified workspace for scientific computing, AI research, and optimization. Access SimCore, MEZAN, TalAI, OptiLibria, and QMLab dashboards.';
const DEFAULT_IMAGE = '/og-image.png'; // TODO: Create and add OG image to public folder
const BASE_URL = 'https://alawein.com'; // TODO: Update with actual production URL

export function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [
    'scientific computing',
    'AI research',
    'simulation',
    'optimization',
    'quantum mechanics',
  ],
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  noindex = false,
  nofollow = false,
  structuredData,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : undefined;

  // Default Organization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/alawein', // TODO: Update with actual social links
      'https://github.com/alawein',
      'https://linkedin.com/company/alawein',
    ],
  };

  // Software Application schema for the platform
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'Scientific Computing',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      {/* Robots */}
      <meta
        name="robots"
        content={`${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`}
      />
      {/* OpenGraph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && <meta property="article:author" content={author} />}
      {type === 'article' && section && <meta property="article:section" content={section} />}
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@alawein" />{' '}
      {/* TODO: Update with actual Twitter handle */}
      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({ '@context': 'https://schema.org', ...structuredData })}
        </script>
      )}
    </Helmet>
  );
}

export default SEOHead;
