import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  MapPin,
  Scale,
  ShieldCheck,
  Trees,
} from 'lucide-react';
import {
  excerpt,
  formatDate,
  formatTime,
  imageAltForPerson,
  locationsById,
  policyUrl,
  postUrl,
  type Policy,
  type Politician,
  type Post,
} from '../lib/med-data';

type ImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallback?: string;
  loading?: 'eager' | 'lazy';
};

function fallbackInitials(value: string) {
  const words = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return 'MED';
  }

  if (words.length === 1 && words[0].length <= 4) {
    return words[0].toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

type PolicyIconKind = 'shield' | 'scale' | 'work' | 'school' | 'care' | 'home' | 'nature' | 'state';

function policyIconKindFor(policy: Policy): PolicyIconKind {
  const text = `${policy.title} ${policy.description || ''} ${policy.content || ''}`.toLowerCase();

  if (text.includes('trygg') || text.includes('brott') || text.includes('rätts')) {
    return 'shield';
  }

  if (text.includes('frihet') || text.includes('demokrati')) {
    return 'scale';
  }

  if (text.includes('skatt') || text.includes('företag') || text.includes('arbete') || text.includes('jobb')) {
    return 'work';
  }

  if (text.includes('skola') || text.includes('universitet') || text.includes('utbild')) {
    return 'school';
  }

  if (text.includes('vård') || text.includes('omsorg')) {
    return 'care';
  }

  if (text.includes('bostad') || text.includes('kommun')) {
    return 'home';
  }

  if (text.includes('miljö') || text.includes('energi') || text.includes('natur')) {
    return 'nature';
  }

  return 'state';
}

function PolicyGlyph({ policy }: { policy: Policy }) {
  const kind = policyIconKindFor(policy);

  if (kind === 'shield') {
    return <ShieldCheck size={24} />;
  }

  if (kind === 'scale') {
    return <Scale size={24} />;
  }

  if (kind === 'work') {
    return <BriefcaseBusiness size={24} />;
  }

  if (kind === 'school') {
    return <GraduationCap size={24} />;
  }

  if (kind === 'care') {
    return <HeartPulse size={24} />;
  }

  if (kind === 'home') {
    return <Home size={24} />;
  }

  if (kind === 'nature') {
    return <Trees size={24} />;
  }

  return <Landmark size={24} />;
}

export function OriginalImage({ src, alt, className = '', fallback, loading = 'lazy' }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const usableSrc = src && !failed ? src : '';

  if (!usableSrc) {
    const fallbackLabel = fallback || alt;
    const initials = fallbackInitials(fallbackLabel);

    return (
      <div className={`image-fallback ${className}`} aria-label={alt} data-initials={initials}>
        <span className="fallback-initials" aria-hidden="true">
          {initials}
        </span>
        <span className="fallback-eyebrow">MED</span>
        <span className="fallback-label">{fallbackLabel}</span>
      </div>
    );
  }

  return <img src={usableSrc} alt={alt} className={className} loading={loading} onError={() => setFailed(true)} />;
}

export function HtmlContent({ html, className = '' }: { html?: string | null; className?: string }) {
  if (!html) {
    return null;
  }

  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function SectionIntro({
  kicker,
  title,
  children,
  align = 'left',
}: {
  kicker?: string;
  title: string;
  children?: ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`section-intro ${align === 'center' ? 'section-intro-center' : ''}`}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      {children ? <div className="intro-copy">{children}</div> : null}
    </div>
  );
}

export function PageHero({
  title,
  text,
  image,
  imageAlt,
  eyebrow,
  actions,
}: {
  title: string;
  text?: string;
  image?: string | null;
  imageAlt?: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {text ? <p>{text}</p> : null}
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>
      <OriginalImage src={image} alt={imageAlt || title} className="page-hero-image" fallback="MED" loading="eager" />
    </section>
  );
}

export function CtaLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="cta-link">
      <span>{children}</span>
      <ArrowRight size={18} />
    </Link>
  );
}

export function ExternalCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="cta-link" target="_blank" rel="noreferrer">
      <span>{children}</span>
      <ExternalLink size={18} />
    </a>
  );
}

export function PolicyCard({ policy }: { policy: Policy }) {
  return (
    <Link to={policyUrl(policy)} className="policy-card">
      <div className="policy-media">
        <OriginalImage src={policy.featured_image} alt={policy.title} className="card-image" fallback={policy.title} />
        <span className="policy-card-icon" aria-hidden="true">
          <PolicyGlyph policy={policy} />
        </span>
      </div>
      <div className="policy-card-body">
        <p className="kicker">{policy.type || 'Politik'}</p>
        <h3>{policy.title}</h3>
        <p>{excerpt(policy.description || policy.content, 132)}</p>
      </div>
      <span className="card-more">Läs mer om {policy.title}</span>
    </Link>
  );
}

export function PersonCard({
  person,
  image,
  meta,
  to,
}: {
  person: Politician | { name: string; slug?: string | null };
  image?: string | null;
  meta?: string | null;
  to: string;
}) {
  return (
    <Link to={to} className="person-card">
      <OriginalImage src={image} alt={imageAltForPerson(person.name)} className="portrait-image" fallback={person.name} />
      <div>
        <h3>{person.name}</h3>
        {meta ? <p>{meta}</p> : null}
      </div>
    </Link>
  );
}

export function PostCard({ post }: { post: Post }) {
  const location = post.location ? locationsById.get(post.location) : undefined;
  const time = post.start_date ? `${formatDate(post.start_date)} ${formatTime(post.start_date)}`.trim() : '';

  return (
    <Link to={postUrl(post)} className="post-card">
      <OriginalImage src={post.image} alt={post.image_text || post.name} className="card-image" fallback={post.type} />
      <div className="post-card-body">
        <p className="kicker">{post.type === 'evenemang' ? 'Evenemang' : 'Aktuellt'}</p>
        <h3>{post.name}</h3>
        <p>{excerpt(post.description, 150)}</p>
        <div className="meta-row">
          {time ? (
            <span>
              <CalendarDays size={15} />
              {time}
            </span>
          ) : null}
          {location ? (
            <span>
              <MapPin size={15} />
              {location.city || location.name}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function NotFoundBlock() {
  return (
    <section className="plain-page">
      <div className="narrow">
        <p className="kicker">404</p>
        <h1>Sidan hittades inte</h1>
        <p>Den här sidan finns inte i den exporterade versionen.</p>
        <CtaLink to="/">Till startsidan</CtaLink>
      </div>
    </section>
  );
}
