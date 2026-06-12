import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ExternalLink, MapPin } from 'lucide-react';
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

export function OriginalImage({ src, alt, className = '', fallback, loading = 'lazy' }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const usableSrc = src && !failed ? src : '';

  if (!usableSrc) {
    return (
      <div className={`image-fallback ${className}`} aria-label={alt}>
        <span>{fallback || alt.slice(0, 2).toUpperCase()}</span>
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
      <OriginalImage src={policy.featured_image} alt={policy.title} className="card-image" fallback={policy.title} />
      <div>
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
