import medDataJson from '../data/med-data.json';

export type Seo = {
  title?: string;
  description?: string;
};

export type HeroImage = {
  id: string;
  page_slug: string;
  image_url: string;
  alt_text: string | null;
  is_active: boolean;
};

export type Policy = {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  featured_image: string | null;
  type: string | null;
  pdf_document: string | null;
  slug: string | null;
  order_index: number | null;
  important: boolean | null;
  seo: Seo | null;
};

export type Politician = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image_url: string | null;
  half_image_url: string | null;
  slug: string | null;
  seo: Seo | null;
};

export type President = {
  id: string;
  name: string;
  image_url: string | null;
  hero_image_url: string | null;
  position: string;
  slogan: string | null;
  text_1: string | null;
  text_2: string | null;
  alt_text: string | null;
  slug: string | null;
  seo: Seo | null;
};

export type Spokesperson = {
  id: string;
  name: string;
  political_area: string;
  short_description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  additional_text: string | null;
  alt_text: string | null;
  slug: string | null;
  seo: Seo | null;
};

export type SpokespersonImage = {
  id: string;
  spokesperson_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean | null;
  sort_order: number | null;
};

export type District = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  heart_issues_intro: string | null;
  heart_issues_points: string[] | null;
  heart_issues_title: string | null;
  local_program_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  x_url: string | null;
  local_info: string | null;
  contact_email: string | null;
  display_name: string | null;
  seo: Seo | null;
};

export type Municipality = District & {
  district_id: string;
  landing_page: boolean | null;
};

export type PoliticianAssignment = {
  id: string;
  politician_id: string;
  district_id: string | null;
  municipality_id: string | null;
  role: string | null;
  is_leader: boolean | null;
};

export type Location = {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  url: string | null;
  district_id: string | null;
};

export type Post = {
  id: string;
  type: 'evenemang' | 'nyhet' | 'pressmeddelande' | string;
  name: string;
  image: string | null;
  image_text: string | null;
  seo: Seo | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: number | null;
  organizer: string | null;
  link: string | null;
  is_published: boolean | null;
  district_id: string | null;
  video_url: string | null;
  slug: string;
};

export type RiksCandidate = {
  id: string;
  position: number;
  name: string;
  profession: string | null;
  city: string | null;
  email: string | null;
  varfor_kandiderar: string | null;
  vem_ar_du: string | null;
  erfarenhet: string | null;
  viktigaste_fraga_1: string | null;
  viktigaste_fraga_2: string | null;
  viktigaste_fraga_3: string | null;
  hur_arbeta: string | null;
  age: number | null;
  image_url: string | null;
  is_active: boolean | null;
  slug: string | null;
  citat: string | null;
};

export type SiteContent = {
  id: string;
  page: string;
  section: string;
  title: string;
  content: string;
  section_order: number;
};

export type PartyGrowthMetric = {
  id: string;
  year: string;
  mandates: number;
  municipalities: number;
  display_order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  city: string | null;
  photo_url: string | null;
  job_title: string | null;
  age: number | null;
  description: string | null;
  is_active: boolean | null;
  order_index: number | null;
};

export type WhyMedSection = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  is_active: boolean | null;
};

export type Valloefte = {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  color_theme: string | null;
  icon_name: string | null;
  image_url: string | null;
  is_active: boolean | null;
};

export type LocalDocument = {
  id: string;
  title: string;
  file_url: string;
  file_name: string;
  district_id: string | null;
  municipality_id: string | null;
  sort_order: number | null;
};

export type MunicipalityContentBlock = {
  id: string;
  municipality_id: string | null;
  district_id: string | null;
  block_type: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  image_position: string | null;
  link_url: string | null;
  link_text: string | null;
  block_data: unknown;
  sort_order: number | null;
  is_published: boolean | null;
};

export type Granskning = {
  id: string;
  title: string;
  slug: string;
  order_index: number;
  bakgrund: string | null;
  insats: string | null;
  is_published: boolean | null;
};

export type GranskningLink = {
  id: string;
  granskning_id: string;
  group_title: string | null;
  title: string;
  url: string;
  link_type: string | null;
  order_index: number | null;
  document_content: string | null;
};

export type PodcastEpisode = {
  id: string;
  title: string;
  description: string | null;
  pub_date: string;
  audio_url: string | null;
  duration: string | null;
  episode_number: number | null;
  image_url: string | null;
  link: string | null;
};

export type MedTables = {
  districts: District[];
  granskningar: Granskning[];
  granskning_links: GranskningLink[];
  hero_images: HeroImage[];
  local_documents: LocalDocument[];
  locations: Location[];
  municipalities: Municipality[];
  municipality_content_blocks: MunicipalityContentBlock[];
  party_growth_metrics: PartyGrowthMetric[];
  podcast_episodes_cache: PodcastEpisode[];
  policies: Policy[];
  politician_assignments: PoliticianAssignment[];
  politicians: Politician[];
  posts: Post[];
  presidents: President[];
  riksdagslista_kandidater: RiksCandidate[];
  site_content: SiteContent[];
  spokesperson_images: SpokespersonImage[];
  spokespersons: Spokesperson[];
  testimonials: Testimonial[];
  valloften: Valloefte[];
  why_med_section: WhyMedSection[];
};

export type MedData = {
  source: {
    siteOrigin: string;
    bundleUrl: string;
    exportedAt: string | null;
  };
  tables: MedTables;
};

export const medData = medDataJson as MedData;
export const tables = medData.tables;

export const siteSource = medData.source;

export const politiciansById = new Map(tables.politicians.map((politician) => [politician.id, politician]));
export const politiciansBySlug = new Map(
  tables.politicians.filter((politician) => politician.slug).map((politician) => [politician.slug, politician]),
);
export const districtsById = new Map(tables.districts.map((district) => [district.id, district]));
export const districtsBySlug = new Map(tables.districts.map((district) => [district.slug, district]));
export const municipalitiesById = new Map(tables.municipalities.map((municipality) => [municipality.id, municipality]));
export const municipalitiesBySlug = new Map(
  tables.municipalities.map((municipality) => [`${municipality.district_id}:${municipality.slug}`, municipality]),
);
export const locationsById = new Map(tables.locations.map((location) => [location.id, location]));

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function stripHtml(html: string | null | undefined) {
  return String(html ?? '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerpt(html: string | null | undefined, length = 180) {
  const text = stripHtml(html);
  return text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, '')}...` : text;
}

export function formatDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions = {}) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(new Date(value));
}

export function formatTime(value: string | null | undefined) {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function heroFor(pageSlug: string) {
  return tables.hero_images.find((hero) => hero.page_slug === pageSlug && hero.is_active) ?? null;
}

export function homeHeroes() {
  return tables.hero_images.filter((hero) => hero.page_slug === 'home' && hero.is_active);
}

export function policySlug(policy: Policy) {
  return policy.slug || slugify(policy.title);
}

export function policyUrl(policy: Policy) {
  return `/politik/${policySlug(policy)}`;
}

export function postUrl(post: Post) {
  return post.type === 'evenemang' ? `/evenemang/${post.slug}` : `/aktuellt/${post.slug}`;
}

export function assignmentsForPolitician(politicianId: string) {
  return tables.politician_assignments.filter((assignment) => assignment.politician_id === politicianId);
}

export function assignmentsForDistrict(districtId: string, municipalityId?: string | null) {
  return tables.politician_assignments.filter((assignment) => {
    if (municipalityId !== undefined) {
      return assignment.municipality_id === municipalityId;
    }

    return assignment.district_id === districtId && !assignment.municipality_id;
  });
}

export function municipalitiesForDistrict(districtId: string) {
  return tables.municipalities.filter((municipality) => municipality.district_id === districtId);
}

export function localDocumentsFor(districtId: string | null, municipalityId?: string | null) {
  return tables.local_documents.filter((document) => {
    if (municipalityId !== undefined) {
      return document.municipality_id === municipalityId;
    }

    return document.district_id === districtId && !document.municipality_id;
  });
}

export function contentBlocksForMunicipality(municipalityId: string) {
  return tables.municipality_content_blocks.filter(
    (block) => block.municipality_id === municipalityId && block.is_published,
  );
}

export function primarySpokespersonImage(spokesperson: Spokesperson) {
  const images = tables.spokesperson_images.filter((image) => image.spokesperson_id === spokesperson.id);
  return images.find((image) => image.is_primary)?.image_url ?? images[0]?.image_url ?? spokesperson.hero_image_url ?? '';
}

export function politicianImage(politician: Politician | undefined | null) {
  return politician?.image_url || politician?.half_image_url || '';
}

export function candidateImage(candidate: RiksCandidate) {
  const bySlug = candidate.slug ? politiciansBySlug.get(candidate.slug) : undefined;
  const byName = tables.politicians.find((politician) => slugify(politician.name) === slugify(candidate.name));
  return candidate.image_url || politicianImage(bySlug) || politicianImage(byName) || '';
}

export function imageAltForPerson(name: string) {
  return `Porträtt av ${name}`;
}

export const publishedPosts = tables.posts.filter((post) => post.is_published);
export const eventPosts = publishedPosts.filter((post) => post.type === 'evenemang');
export const newsPosts = publishedPosts.filter((post) => post.type !== 'evenemang');
export const upcomingEvents = eventPosts.filter((post) => {
  if (!post.start_date) {
    return false;
  }

  return new Date(post.start_date).getTime() >= Date.now() - 24 * 60 * 60 * 1000;
});

export const latestNews = [...newsPosts].sort((a, b) => {
  const left = new Date(a.start_date ?? a.id).getTime();
  const right = new Date(b.start_date ?? b.id).getTime();
  return right - left;
});

export const primaryPolicies = tables.policies.filter((policy) => policy.type === 'primär');
export const importantPolicies = tables.policies.filter((policy) => policy.important);
