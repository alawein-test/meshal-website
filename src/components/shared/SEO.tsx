// SEO Component for meta tags and Open Graph data
import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  author?: string;
  twitterHandle?: string;
}

export function SEO({
  title,
  description,
  image = '/og-image.png',
  url = window.location.href,
  type = 'website',
  keywords = [],
  author = 'M. Alawein',
  twitterHandle = '@alawein',
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | M. Alawein`;

    // Helper to update or create meta tag
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    setMeta('description', description);
    setMeta('author', author);
    if (keywords.length > 0) {
      setMeta('keywords', keywords.join(', '));
    }

    // Open Graph tags
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:url', url, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', 'M. Alawein', true);

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
    setMeta('twitter:site', twitterHandle);
    setMeta('twitter:creator', twitterHandle);

    // Cleanup function to reset title on unmount
    return () => {
      document.title = 'M. Alawein | Scientific Computing & AI Research';
    };
  }, [title, description, image, url, type, keywords, author, twitterHandle]);

  return null;
}

export default SEO;
