import {
  candidateImage,
  excerpt,
  heroFor,
  policyUrl,
  postUrl,
  tables,
} from './med-data';

export type PageMeta = {
  title: string;
  description: string;
  image?: string | null;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type ElectionLink = {
  label: string;
  to: string;
  text: string;
};

export const siteUrl = 'https://med-se.pages.dev';
export const siteName = 'Medborgerlig Samling';
export const siteTagline = 'Frihet, trygghet och framtidstro';
export const defaultTitle = 'Medborgerlig Samling | Förändring. På riktigt.';
export const defaultDescription =
  'Medborgerlig Samling är ett konservativt och borgerligt parti för frihet, trygghet och framtidstro.';
export const defaultOgImage = heroFor('home')?.image_url ?? 'https://www.med.se/logo.png';
export const logoUrl = 'https://www.med.se/logo.png';

export const socialLinks: SocialLink[] = [
  { label: 'Facebook', href: 'https://facebook.com/MedborgerligSamling' },
  { label: 'Instagram', href: 'https://instagram.com/MedborgerligSamling' },
  { label: 'YouTube', href: 'https://youtube.com/@MedborgerligSamling' },
  { label: 'TikTok', href: 'https://tiktok.com/@MedborgerligSamling' },
  { label: 'X', href: 'https://x.com/medborgsamling' },
];

export const electionLinks: ElectionLink[] = [
  {
    label: 'Val 2026',
    to: '/val-2026',
    text: 'Samlad väg in till valet, riksdagslistan och prioriterade valfrågor.',
  },
  {
    label: 'Valfrågor',
    to: '/politik',
    text: 'MED:s politik för frihet, trygghet och ansvar i hela landet.',
  },
  {
    label: 'Riksdagslistan',
    to: '/riksdagslistan',
    text: 'Kandidaterna som söker väljarnas förtroende inför riksdagsvalet.',
  },
  {
    label: 'Partiledare har ordet',
    to: '/partiledare-har-ordet',
    text: 'Daniel Sonessons budskap om varför Sverige behöver en politisk omstart.',
  },
  {
    label: 'Kommunobligationer',
    to: '/kommunobligationer',
    text: 'Granskning av kommunal skuldsättning och ansvar för offentliga pengar.',
  },
];

const staticRouteMeta: Record<string, PageMeta> = {
  '/': {
    title: defaultTitle,
    description: defaultDescription,
    image: defaultOgImage,
  },
  '/val-2026': {
    title: `Val 2026 | ${siteName}`,
    description:
      'Samlad valhub för MED:s väg till riksdagen 2026 med valfrågor, riksdagslista och partiledarens budskap.',
    image: heroFor('riksdagslistan')?.image_url ?? defaultOgImage,
  },
  '/politik': {
    title: `Politik | ${siteName}`,
    description:
      'Läs MED:s politik för ett friare, tryggare och mer ansvarstagande Sverige.',
    image: heroFor('about')?.image_url ?? defaultOgImage,
  },
  '/politiker': {
    title: `Politiker | ${siteName}`,
    description: 'Möt Medborgerlig Samlings partiledning, talespersoner, riksdagskandidater och lokala företrädare.',
    image: tables.presidents[0]?.hero_image_url ?? tables.presidents[0]?.image_url ?? defaultOgImage,
  },
  '/riksdagslistan': {
    title: `Riksdagslistan | ${siteName}`,
    description: 'MED:s riksdagskandidater inför valet 2026.',
    image: heroFor('riksdagslistan')?.image_url ?? defaultOgImage,
  },
  '/distrikt': {
    title: `Distrikt | ${siteName}`,
    description: 'Hitta Medborgerlig Samling nära dig och se lokala företrädare, kontaktvägar och dokument.',
    image: heroFor('districts')?.image_url ?? defaultOgImage,
  },
  '/evenemang': {
    title: `Evenemang | ${siteName}`,
    description: 'Träffa MED på föreläsningar, kampanjer och lokala evenemang runt om i Sverige.',
    image: heroFor('events')?.image_url ?? defaultOgImage,
  },
  '/aktuellt': {
    title: `Aktuellt | ${siteName}`,
    description: 'Nyheter, pressmeddelanden och aktuella besked från Medborgerlig Samling.',
    image: defaultOgImage,
  },
  '/om': {
    title: `Om MED | ${siteName}`,
    description: 'Läs mer om Medborgerlig Samling, partiets idé och organisation.',
    image: heroFor('about')?.image_url ?? defaultOgImage,
  },
  '/partiledare-har-ordet': {
    title: `Partiledare har ordet | ${siteName}`,
    description: 'Daniel Sonessons ord om MED:s uppdrag och vägen mot ett friare och tryggare Sverige.',
    image: tables.presidents[0]?.hero_image_url ?? tables.presidents[0]?.image_url ?? defaultOgImage,
  },
  '/press': {
    title: `Press | ${siteName}`,
    description: 'Presskontakt, pressmeddelanden och nyheter från Medborgerlig Samling.',
    image: defaultOgImage,
  },
  '/alla-ska-med': {
    title: `Alla ska MED | ${siteName}`,
    description: 'MED:s podd om politik, samhälle och ett Sverige med mer frihet och ansvar.',
    image: heroFor('podcast')?.image_url ?? defaultOgImage,
  },
  '/granskningsgruppen': {
    title: `Granskningsgruppen | ${siteName}`,
    description: 'Granskningar och material om slöseri, ansvar och offentliga beslut.',
    image: heroFor('about')?.image_url ?? defaultOgImage,
  },
  '/donera': {
    title: `Donera | ${siteName}`,
    description: 'Stöd Medborgerlig Samlings arbete för frihet, trygghet och framtidstro.',
    image: defaultOgImage,
  },
  '/medlemskap': {
    title: `Bli medlem | ${siteName}`,
    description: 'Bli medlem i Medborgerlig Samling och bidra till en politisk omstart.',
    image: defaultOgImage,
  },
  '/bli-medlem': {
    title: `Bli medlem | ${siteName}`,
    description: 'Bli medlem i Medborgerlig Samling och bidra till en politisk omstart.',
    image: defaultOgImage,
  },
  '/kommunobligationer': {
    title: `Kommunobligationer | ${siteName}`,
    description: 'Granska kommunal skuldsättning och följ MED:s arbete för ekonomiskt ansvar.',
    image: heroFor('kommunobligationer')?.image_url ?? defaultOgImage,
  },
  '/fria-studenter': {
    title: `Fria studenter | ${siteName}`,
    description: 'Studentengagemang för fri debatt, ansvar och öppenhet i akademin.',
    image: heroFor('about')?.image_url ?? defaultOgImage,
  },
  '/integritetspolicy': {
    title: `Integritetspolicy | ${siteName}`,
    description: 'Så hanterar Medborgerlig Samling personuppgifter och integritet på webbplatsen.',
    image: heroFor('about')?.image_url ?? defaultOgImage,
  },
  '/cookiepolicy': {
    title: `Cookiepolicy | ${siteName}`,
    description: 'Information om cookies, samtycke och hur du ändrar dina cookie-inställningar hos MED.',
    image: heroFor('about')?.image_url ?? defaultOgImage,
  },
};

function normalizePath(pathname: string) {
  const cleanPath = pathname.split('?')[0].split('#')[0] || '/';
  if (cleanPath === '/') {
    return '/';
  }

  return cleanPath.replace(/\/+$/, '');
}

function withSiteName(title: string) {
  return title.includes(siteName) ? title : `${title} | ${siteName}`;
}

export function absoluteUrl(pathname = '/') {
  const path = normalizePath(pathname);
  return `${siteUrl}${path === '/' ? '/' : path}`;
}

export function metadataForPath(pathname: string): PageMeta {
  const path = normalizePath(pathname);
  const staticMeta = staticRouteMeta[path];

  if (staticMeta) {
    return staticMeta;
  }

  const policy = tables.policies.find((item) => policyUrl(item) === path);
  if (policy) {
    return {
      title: withSiteName(policy.seo?.title || policy.title),
      description: excerpt(policy.seo?.description || policy.description || policy.content, 158),
      image: policy.featured_image || defaultOgImage,
    };
  }

  const president = tables.presidents.find((item) => item.slug && `/politiker/${item.slug}` === path);
  if (president) {
    return {
      title: withSiteName(president.seo?.title || president.name),
      description: excerpt(president.seo?.description || president.slogan || president.text_1, 158),
      image: president.hero_image_url || president.image_url || defaultOgImage,
    };
  }

  const spokesperson = tables.spokespersons.find((item) => item.slug && `/politiker/${item.slug}` === path);
  if (spokesperson) {
    return {
      title: withSiteName(spokesperson.seo?.title || spokesperson.name),
      description: excerpt(spokesperson.seo?.description || spokesperson.short_description || spokesperson.long_description, 158),
      image: spokesperson.hero_image_url || defaultOgImage,
    };
  }

  const politician = tables.politicians.find((item) => item.slug && `/politiker/${item.slug}` === path);
  if (politician) {
    return {
      title: withSiteName(politician.seo?.title || politician.name),
      description: excerpt(politician.seo?.description || politician.bio || 'Företrädare för Medborgerlig Samling.', 158),
      image: politician.image_url || politician.half_image_url || defaultOgImage,
    };
  }

  const candidate = tables.riksdagslista_kandidater.find((item) => item.slug && `/riksdagslistan/${item.slug}` === path);
  if (candidate) {
    return {
      title: withSiteName(candidate.name),
      description: excerpt(candidate.citat || candidate.varfor_kandiderar || 'Riksdagskandidat för Medborgerlig Samling.', 158),
      image: candidateImage(candidate) || defaultOgImage,
    };
  }

  const district = tables.districts.find((item) => `/distrikt/${item.slug}` === path);
  if (district) {
    return {
      title: withSiteName(district.seo?.title || district.display_name || district.name),
      description: excerpt(district.seo?.description || district.description || district.local_info, 158),
      image: district.image_url || defaultOgImage,
    };
  }

  const municipality = tables.municipalities.find((item) => `/distrikt/${item.slug}` === path || path.endsWith(`/${item.slug}`));
  if (municipality) {
    return {
      title: withSiteName(municipality.seo?.title || municipality.display_name || municipality.name),
      description: excerpt(municipality.seo?.description || municipality.description || municipality.local_info, 158),
      image: municipality.image_url || defaultOgImage,
    };
  }

  const post = tables.posts.find((item) => postUrl(item) === path);
  if (post) {
    return {
      title: withSiteName(post.seo?.title || post.name),
      description: excerpt(post.seo?.description || post.description, 158),
      image: post.image || defaultOgImage,
    };
  }

  return {
    title: `Sidan hittades inte | ${siteName}`,
    description: 'Sidan kunde inte hittas på Medborgerlig Samlings webbplats.',
    image: defaultOgImage,
  };
}
