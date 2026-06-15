import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  absoluteUrl,
  defaultOgImage,
  logoUrl,
  metadataForPath,
  siteName,
  siteTagline,
  siteUrl,
  socialLinks,
} from '../lib/site-meta';

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  element.href = href;
}

function upsertStructuredData(data: object) {
  const id = 'site-structured-data';
  let element = document.getElementById(id) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

export function Seo() {
  const location = useLocation();

  useEffect(() => {
    const meta = metadataForPath(location.pathname);
    const canonical = absoluteUrl(location.pathname);
    const image = meta.image || defaultOgImage;

    document.title = meta.title;
    upsertCanonical(canonical);
    upsertMeta('name', 'description', meta.description);
    upsertMeta('name', 'robots', 'index,follow');
    upsertMeta('property', 'og:site_name', siteName);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', meta.title);
    upsertMeta('property', 'og:description', meta.description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:locale', 'sv_SE');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', meta.title);
    upsertMeta('name', 'twitter:description', meta.description);
    upsertMeta('name', 'twitter:image', image);

    upsertStructuredData({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${siteUrl}/#organization`,
          name: siteName,
          url: siteUrl,
          logo: {
            '@type': 'ImageObject',
            url: logoUrl,
          },
          sameAs: socialLinks.map((link) => link.href),
          slogan: siteTagline,
        },
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          name: siteName,
          url: siteUrl,
          inLanguage: 'sv-SE',
          publisher: {
            '@id': `${siteUrl}/#organization`,
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          name: meta.title,
          description: meta.description,
          url: canonical,
          inLanguage: 'sv-SE',
          isPartOf: {
            '@id': `${siteUrl}/#website`,
          },
          about: {
            '@id': `${siteUrl}/#organization`,
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: image,
          },
        },
      ],
    });
  }, [location.pathname]);

  return null;
}
