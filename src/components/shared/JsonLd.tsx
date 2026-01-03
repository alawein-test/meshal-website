// JSON-LD Structured Data Component for SEO
import { useEffect } from 'react';

interface PersonSchema {
  type: 'Person';
  name: string;
  jobTitle: string;
  url: string;
  sameAs?: string[];
  knowsAbout?: string[];
  image?: string;
}

interface WebsiteSchema {
  type: 'WebSite';
  name: string;
  url: string;
  description: string;
  author?: string;
}

interface SoftwareApplicationSchema {
  type: 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  author?: string;
}

interface BreadcrumbSchema {
  type: 'BreadcrumbList';
  items: { name: string; url: string }[];
}

type SchemaType = PersonSchema | WebsiteSchema | SoftwareApplicationSchema | BreadcrumbSchema;

interface JsonLdProps {
  schema: SchemaType;
}

export function JsonLd({ schema }: JsonLdProps) {
  useEffect(() => {
    const scriptId = `jsonld-${schema.type.toLowerCase()}`;

    // Remove existing script if present
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Create structured data based on schema type
    let structuredData: object;

    switch (schema.type) {
      case 'Person':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: schema.name,
          jobTitle: schema.jobTitle,
          url: schema.url,
          sameAs: schema.sameAs || [],
          knowsAbout: schema.knowsAbout || [],
          image: schema.image,
        };
        break;

      case 'WebSite':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: schema.name,
          url: schema.url,
          description: schema.description,
          author: schema.author
            ? {
                '@type': 'Person',
                name: schema.author,
              }
            : undefined,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${schema.url}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };
        break;

      case 'SoftwareApplication':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: schema.name,
          description: schema.description,
          applicationCategory: schema.applicationCategory,
          operatingSystem: schema.operatingSystem || 'Web',
          author: schema.author
            ? {
                '@type': 'Person',
                name: schema.author,
              }
            : undefined,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        };
        break;

      case 'BreadcrumbList':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: schema.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };
        break;

      default:
        return;
    }

    // Create and append script element
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema]);

  return null;
}

// Pre-configured schemas for common use cases
export const schemas = {
  person: {
    type: 'Person' as const,
    name: 'M. Alawein',
    jobTitle: 'Scientific Computing & AI Research Engineer',
    url: 'https://alawein.dev',
    sameAs: [
      'https://github.com/alawein',
      'https://linkedin.com/in/alawein',
      'https://twitter.com/alawein',
    ],
    knowsAbout: [
      'Scientific Computing',
      'Machine Learning',
      'Quantum Mechanics',
      'Optimization Algorithms',
      'Full-Stack Development',
      'AI Research',
    ],
  },
  website: {
    type: 'WebSite' as const,
    name: 'M. Alawein',
    url: 'https://alawein.dev',
    description:
      'Scientific Computing & AI Research Platform featuring SimCore, TalAI, QMLab, OptiLibria, and MEZAN projects.',
    author: 'M. Alawein',
  },
  simcore: {
    type: 'SoftwareApplication' as const,
    name: 'SimCore',
    description: 'High-performance scientific simulation engine for complex computational models',
    applicationCategory: 'Scientific Computing',
    author: 'M. Alawein',
  },
  talai: {
    type: 'SoftwareApplication' as const,
    name: 'TalAI',
    description: 'Machine learning experimentation platform for AI research and model training',
    applicationCategory: 'Artificial Intelligence',
    author: 'M. Alawein',
  },
  qmlab: {
    type: 'SoftwareApplication' as const,
    name: 'QMLab',
    description:
      'Quantum mechanics laboratory for particle physics simulations and wave function analysis',
    applicationCategory: 'Quantum Computing',
    author: 'M. Alawein',
  },
  optilibria: {
    type: 'SoftwareApplication' as const,
    name: 'OptiLibria',
    description:
      'Advanced optimization library featuring genetic algorithms, particle swarm, and gradient descent',
    applicationCategory: 'Optimization',
    author: 'M. Alawein',
  },
  mezan: {
    type: 'SoftwareApplication' as const,
    name: 'MEZAN',
    description: 'Enterprise workflow automation platform with bilingual Arabic-English support',
    applicationCategory: 'Business Automation',
    author: 'M. Alawein',
  },
};

export default JsonLd;
