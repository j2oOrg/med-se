import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  CalendarDays,
  Download,
  FileText,
  Gavel,
  HandCoins,
  Landmark,
  Mail,
  Map,
  MapPin,
  Newspaper,
  Phone,
  Search,
  Shield,
  Users,
  Vote,
} from 'lucide-react';
import {
  CtaLink,
  ExternalCta,
  HtmlContent,
  NotFoundBlock,
  OriginalImage,
  PageHero,
  PersonCard,
  PolicyCard,
  PostCard,
  SectionIntro,
} from '../components/Blocks';
import { ElectionHub } from '../components/ElectionHub';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { openCookieSettings } from '../lib/cookie-settings';
import {
  assignmentsForDistrict,
  assignmentsForPolitician,
  candidateImage,
  contentBlocksForMunicipality,
  districtsById,
  districtsBySlug,
  eventPosts,
  excerpt,
  formatDate,
  formatTime,
  heroFor,
  homeHeroes,
  imageAltForPerson,
  importantPolicies,
  latestNews,
  localDocumentsFor,
  locationsById,
  municipalitiesById,
  municipalitiesBySlug,
  municipalitiesForDistrict,
  politiciansById,
  politiciansBySlug,
  policySlug,
  postUrl,
  primaryPolicies,
  primarySpokespersonImage,
  publishedPosts,
  siteSource,
  slugify,
  tables,
  upcomingEvents,
  type District,
  type MunicipalityContentBlock,
  type PoliticianAssignment,
  type Post,
} from '../lib/med-data';

function actionText(post: Post) {
  if (post.type === 'pressmeddelande') {
    return 'Pressmeddelande';
  }

  if (post.type === 'nyhet') {
    return 'Nyhet';
  }

  return 'Evenemang';
}

function roleText(assignment: PoliticianAssignment) {
  const district = assignment.district_id ? districtsById.get(assignment.district_id) : undefined;
  const municipality = assignment.municipality_id ? municipalitiesById.get(assignment.municipality_id) : undefined;
  const place = municipality?.name || district?.name;
  return [assignment.role, place].filter(Boolean).join(', ');
}

function districtDisplayName(district: District) {
  return district.display_name || district.name;
}

function peopleForAssignments(assignments: PoliticianAssignment[]) {
  return assignments
    .map((assignment) => {
      const politician = politiciansById.get(assignment.politician_id);
      return politician ? { politician, assignment } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function postsForDistrict(districtId: string) {
  return publishedPosts.filter((post) => post.district_id === districtId);
}

function HeroActions() {
  return (
    <>
      <CtaLink to="/medlemskap">Bli medlem</CtaLink>
      <CtaLink to="/politik">Läs vår politik</CtaLink>
    </>
  );
}

export function HomePage() {
  const hero = homeHeroes()[0] ?? heroFor('home');
  const latestMetric = tables.party_growth_metrics[tables.party_growth_metrics.length - 1];
  const whyMed = tables.why_med_section.find((section) => section.is_active);
  const topNews = latestNews.slice(0, 3);
  const topEvents = upcomingEvents.slice(0, 3);

  return (
    <div className="home-page campaign-home">
      <section className="home-hero">
        <OriginalImage
          src={hero?.image_url}
          alt={hero?.alt_text || 'Medborgerlig Samling'}
          className="home-hero-image"
          fallback="MED"
          loading="eager"
        />
        <div className="home-hero-overlay">
          <div className="home-hero-content">
            <p className="kicker">Medborgerlig Samling</p>
            <h1>Förändring. På riktigt.</h1>
            <p>
              Ett konservativt parti för frihet, trygghet och framtidstro. Vi vill kapa skatteslöseri, stärka
              rättsstaten och ge Sverige en politisk omstart.
            </p>
            <div className="hero-actions">
              <HeroActions />
            </div>
          </div>
        </div>
      </section>

      <section className="metric-band">
        <div>
          <span>{latestMetric?.mandates ?? 0}</span>
          <p>mandat i kommuner</p>
        </div>
        <div>
          <span>{latestMetric?.municipalities ?? 0}</span>
          <p>kommuner med mandat</p>
        </div>
        <div>
          <span>{tables.districts.length}</span>
          <p>distrikt i landet</p>
        </div>
        <div>
          <span>{tables.politicians.length}</span>
          <p>lokala företrädare</p>
        </div>
      </section>

      <NewsletterSignup className="home-newsletter" />
      <ElectionHub className="home-election-hub" />

      <section className="content-section campaign-section">
        <div className="campaign-copy">
          <SectionIntro kicker="Omstartspartiet" title="Mindre politikermakt. Mer ansvar där det räknas.">
            <p>
              MED vill kapa skatteslöseriet, riva onödig byråkrati och flytta politiken tillbaka till kärnuppgifterna:
              trygghet, vård, skola, försvar och respekt för den enskilde.
            </p>
          </SectionIntro>
          <p>
            Det är en konservativ och borgerlig omstart med fokus på fungerande institutioner, lägre bördor för arbete
            och företagande och mer makt över den egna vardagen.
          </p>
          <div className="campaign-actions">
            <HeroActions />
          </div>
        </div>
        <div className="campaign-pillar-grid">
          <article className="campaign-pillar">
            <HandCoins size={24} />
            <h3>Kapa slöseriet</h3>
            <p>Offentliga pengar ska gå till kärnuppgifter, inte byråkrati, bidragsfusk och prestigeprojekt.</p>
          </article>
          <article className="campaign-pillar">
            <Shield size={24} />
            <h3>Återupprätta tryggheten</h3>
            <p>Lagar ska upprätthållas, brott få konsekvenser och staten stå på laglydiga medborgares sida.</p>
          </article>
          <article className="campaign-pillar">
            <Landmark size={24} />
            <h3>Ge makten tillbaka</h3>
            <p>Mindre pekpinnar och mer ansvar nära människor, familjer, företag och lokalsamhällen.</p>
          </article>
        </div>
      </section>

      <section className="content-section pledge-section">
        <SectionIntro kicker="Valfrågor" title="Reformer som går att genomföra">
          <p>
            Handlingskraften i originalets valfrågor är tydlig: bekämpa slöseri, stärk rättsstaten och skapa bättre
            villkor för arbete, företagande och ansvarstagande.
          </p>
        </SectionIntro>
        <div className="promise-list promise-list-featured">
          {tables.valloften
            .filter((promise) => promise.is_active)
            .slice(0, 8)
            .map((promise) => (
              <article key={promise.id} className="promise-item">
                <span>{promise.order_index}</span>
                <h3>{promise.title}</h3>
              </article>
            ))}
        </div>
      </section>

      <section className="content-section">
        <SectionIntro kicker="Vår politik" title="Tre bärande idéer" align="center">
          <p>De primära politikområdena från originalet lyfts fram först och leder vidare till de fulla texterna.</p>
        </SectionIntro>
        <div className="card-grid three">
          {primaryPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      </section>

      {whyMed ? (
        <section className="content-section split-section reverse why-section">
          <OriginalImage
            src={whyMed.image_url || heroFor('about')?.image_url}
            alt={whyMed.title}
            className="feature-image"
            fallback="MED"
          />
          <div>
            <SectionIntro kicker="Varför MED?" title={whyMed.title} />
            <HtmlContent html={whyMed.content} />
            <CtaLink to="/om">Läs mer om partiet</CtaLink>
          </div>
        </section>
      ) : null}

      <section className="content-section split-section">
        <div>
          <SectionIntro kicker="Evenemang" title="Träffa MED nära dig" />
          <div className="stack-list">
            {topEvents.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <CtaLink to="/evenemang">Alla evenemang</CtaLink>
        </div>
        <div>
          <SectionIntro kicker="Aktuellt" title="Nyheter och press" />
          <div className="stack-list">
            {topNews.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <CtaLink to="/aktuellt">Allt aktuellt</CtaLink>
        </div>
      </section>
    </div>
  );
}

export function ElectionHubPage() {
  const hero = heroFor('riksdagslistan') ?? heroFor('home');

  return (
    <div className="page-theme politics-theme election-page">
      <PageHero
        eyebrow="Val 2026"
        title="Vägen till riksdagen 2026"
        text="Här samlas MED:s valfrågor, riksdagskandidater, partiledarens budskap och granskningen av kommunal ekonomi inför valet."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Val 2026'}
        actions={
          <>
            <CtaLink to="/riksdagslistan">Riksdagslistan</CtaLink>
            <CtaLink to="/politik">Valfrågor</CtaLink>
          </>
        }
      />
      <ElectionHub className="election-page-hub" />
      <section className="content-section pledge-section">
        <SectionIntro kicker="Valfrågor" title="Det MED vill driva i valet">
          <p>
            Valrörelsen ska handla om fungerande kärnuppgifter, lägre slöseri, starkare rättsstat och mer ansvar där
            människor lever sina liv.
          </p>
        </SectionIntro>
        <div className="promise-list promise-list-featured">
          {tables.valloften
            .filter((promise) => promise.is_active)
            .slice(0, 8)
            .map((promise) => (
              <article key={promise.id} className="promise-item">
                <span>{promise.order_index}</span>
                <h3>{promise.title}</h3>
              </article>
            ))}
        </div>
      </section>
      <NewsletterSignup className="home-newsletter election-newsletter" />
    </div>
  );
}

export function PoliticsPage() {
  const hero =
    homeHeroes().find((item) => item.alt_text?.toLowerCase().includes('ek')) ?? heroFor('about') ?? heroFor('home');
  const generalPolicies = tables.policies.filter((policy) => policy.type !== 'primär');

  return (
    <div className="page-theme politics-theme">
      <PageHero
        eyebrow="Vår politik"
        title="Politik för ett friare och tryggare Sverige"
        text="Här finns Medborgerlig Samlings politikområden, med originalets texter och dokumentlänkar bevarade."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Vår politik'}
      />
      <section className="content-section">
        <SectionIntro kicker="Kärna" title="Frihet, trygghet och framtidstro" />
        <div className="card-grid three">
          {primaryPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      </section>
      <section className="content-section">
        <SectionIntro kicker="Sakområde" title="Fördjupad politik" />
        <div className="card-grid">
          {generalPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function PolicyDetailPage() {
  const { slug = '' } = useParams();
  const policy = tables.policies.find((item) => policySlug(item) === slug);

  if (!policy) {
    return <NotFoundBlock />;
  }

  return (
    <div className="page-theme politics-theme">
      <PageHero
        eyebrow={policy.type || 'Politik'}
        title={policy.title}
        text={excerpt(policy.description || policy.content, 240)}
        image={policy.featured_image}
        imageAlt={policy.title}
        actions={
          policy.pdf_document ? (
            <ExternalCta href={policy.pdf_document}>
              <Download size={18} />
              Ladda ner dokument
            </ExternalCta>
          ) : null
        }
      />
      <section className="content-section article-layout">
        <HtmlContent html={policy.description} className="lead-rich" />
        <HtmlContent html={policy.content} />
      </section>
      {importantPolicies.length > 1 ? (
        <section className="content-section">
          <SectionIntro title="Fler prioriterade frågor" />
          <div className="card-grid three">
            {importantPolicies
              .filter((item) => item.id !== policy.id)
              .slice(0, 3)
              .map((item) => (
                <PolicyCard key={item.id} policy={item} />
              ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function PeoplePage() {
  const [query, setQuery] = useState('');
  const leader = tables.presidents.find((president) => president.position === 'Ordförande') ?? tables.presidents[0];
  const normalizedQuery = slugify(query);
  const politicians = useMemo(() => {
    if (!normalizedQuery) {
      return tables.politicians;
    }

    return tables.politicians.filter((politician) => slugify(politician.name).includes(normalizedQuery));
  }, [normalizedQuery]);

  return (
    <div className="page-theme people-theme">
      <PageHero
        eyebrow="Våra politiker"
        title="Människorna bakom MED"
        text="Ledning, talespersoner, riksdagskandidater och lokala företrädare hämtas från originalets persondata."
        image={leader?.hero_image_url || leader?.image_url}
        imageAlt={leader ? imageAltForPerson(leader.name) : 'Våra politiker'}
      />
      <section className="content-section">
        <SectionIntro kicker="Ledning" title="Partiledning" />
        <div className="person-grid leadership-grid">
          {tables.presidents.map((president) => (
            <PersonCard
              key={president.id}
              person={president}
              image={president.image_url || president.hero_image_url}
              meta={president.position}
              to={`/politiker/${president.slug}`}
            />
          ))}
        </div>
      </section>
      <section className="content-section">
        <SectionIntro kicker="Talespersoner" title="Ansvariga inom sakpolitik" />
        <div className="person-grid">
          {tables.spokespersons.map((spokesperson) => (
            <PersonCard
              key={spokesperson.id}
              person={spokesperson}
              image={primarySpokespersonImage(spokesperson)}
              meta={spokesperson.political_area}
              to={`/politiker/${spokesperson.slug}`}
            />
          ))}
        </div>
      </section>
      <section className="content-section">
        <div className="toolbar-row">
          <SectionIntro kicker="Alla företrädare" title="Sök politiker" />
          <label className="search-field">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Sök namn" />
          </label>
        </div>
        <div className="person-grid compact">
          {politicians.slice(0, 120).map((politician) => {
            const firstRole = assignmentsForPolitician(politician.id)[0];
            return (
              <PersonCard
                key={politician.id}
                person={politician}
                image={politician.image_url || politician.half_image_url}
                meta={firstRole ? roleText(firstRole) : 'Medborgerlig Samling'}
                to={`/politiker/${politician.slug}`}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function PersonDetailPage() {
  const { slug = '' } = useParams();
  const president = tables.presidents.find((item) => item.slug === slug);
  const spokesperson = tables.spokespersons.find((item) => item.slug === slug);
  const politician = politiciansBySlug.get(slug);

  if (president) {
    return (
      <>
        <PageHero
          eyebrow={president.position}
          title={president.name}
          text={president.slogan || undefined}
          image={president.hero_image_url || president.image_url}
          imageAlt={president.alt_text || imageAltForPerson(president.name)}
        />
        <section className="content-section article-layout">
          <HtmlContent html={president.text_1} />
          <HtmlContent html={president.text_2} />
        </section>
      </>
    );
  }

  if (spokesperson) {
    return (
      <>
        <PageHero
          eyebrow={spokesperson.political_area}
          title={spokesperson.name}
          text={spokesperson.short_description || undefined}
          image={spokesperson.hero_image_url || primarySpokespersonImage(spokesperson)}
          imageAlt={spokesperson.alt_text || imageAltForPerson(spokesperson.name)}
        />
        <section className="content-section article-layout">
          <HtmlContent html={spokesperson.long_description} />
          <HtmlContent html={spokesperson.additional_text} />
        </section>
      </>
    );
  }

  if (!politician) {
    return <NotFoundBlock />;
  }

  const assignments = assignmentsForPolitician(politician.id);

  return (
    <div className="page-theme people-theme">
      <PageHero
        eyebrow="Politiker"
        title={politician.name}
        text={assignments[0] ? roleText(assignments[0]) : 'Medborgerlig Samling'}
        image={politician.image_url || politician.half_image_url}
        imageAlt={imageAltForPerson(politician.name)}
      />
      <section className="content-section split-section">
        <div>
          <SectionIntro title="Presentation" />
          {politician.bio ? <HtmlContent html={politician.bio} /> : <p>Profilen saknar längre presentation i källdatan.</p>}
        </div>
        <aside className="info-panel">
          <h2>Kontakt och uppdrag</h2>
          <div className="info-list">
            {politician.email ? (
              <a href={`mailto:${politician.email}`}>
                <Mail size={17} />
                {politician.email}
              </a>
            ) : null}
            {politician.phone ? (
              <a href={`tel:${politician.phone}`}>
                <Phone size={17} />
                {politician.phone}
              </a>
            ) : null}
            {assignments.map((assignment) => (
              <span key={assignment.id}>
                <Vote size={17} />
                {roleText(assignment)}
              </span>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}

export function RiksdagsListPage() {
  const hero = heroFor('riksdagslistan') ?? heroFor('politicians');

  return (
    <div className="page-theme people-theme">
      <PageHero
        eyebrow="Riksdagslistan"
        title="Kandidater till riksdagen"
        text="Listan bygger på originalets kandidattabell och matchar porträtt mot persondata när kandidatbild saknas."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Riksdagslistan'}
      />
      <section className="content-section">
        <div className="candidate-list">
          {tables.riksdagslista_kandidater.map((candidate) => (
            <Link key={candidate.id} to={`/riksdagslistan/${candidate.slug}`} className="candidate-row">
              <span className="rank">{candidate.position}</span>
              <OriginalImage
                src={candidateImage(candidate)}
                alt={imageAltForPerson(candidate.name)}
                className="candidate-avatar"
                fallback={candidate.name}
              />
              <div>
                <h3>{candidate.name}</h3>
                <p>{[candidate.profession, candidate.city].filter(Boolean).join(', ')}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function RiksCandidatePage() {
  const { slug = '' } = useParams();
  const candidate = tables.riksdagslista_kandidater.find((item) => item.slug === slug);

  if (!candidate) {
    return <NotFoundBlock />;
  }

  const sections = [
    ['Varför kandiderar du?', candidate.varfor_kandiderar],
    ['Vem är du?', candidate.vem_ar_du],
    ['Erfarenhet', candidate.erfarenhet],
    ['Viktigaste fråga 1', candidate.viktigaste_fraga_1],
    ['Viktigaste fråga 2', candidate.viktigaste_fraga_2],
    ['Viktigaste fråga 3', candidate.viktigaste_fraga_3],
    ['Hur vill du arbeta i riksdagen?', candidate.hur_arbeta],
  ];

  return (
    <div className="page-theme people-theme">
      <PageHero
        eyebrow={`Plats ${candidate.position}`}
        title={candidate.name}
        text={[candidate.profession, candidate.city].filter(Boolean).join(', ')}
        image={candidateImage(candidate)}
        imageAlt={imageAltForPerson(candidate.name)}
      />
      <section className="content-section article-layout">
        {candidate.citat ? <blockquote>{candidate.citat}</blockquote> : null}
        {sections.map(([title, content]) =>
          content ? (
            <article key={title} className="question-block">
              <h2>{title}</h2>
              <p>{content}</p>
            </article>
          ) : null,
        )}
      </section>
    </div>
  );
}

export function DistrictsPage() {
  const hero = heroFor('municipalities') ?? heroFor('home');

  return (
    <div className="page-theme local-theme">
      <PageHero
        eyebrow="Distrikt och kommuner"
        title="MED finns lokalt i hela Sverige"
        text="Distrikt, kommuner, lokala program och lokala politiker hämtas från originalets databas."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Distrikt'}
      />
      <section className="content-section">
        <div className="card-grid">
          {tables.districts.map((district) => {
            const municipalities = municipalitiesForDistrict(district.id);
            const people = assignmentsForDistrict(district.id);

            return (
              <Link key={district.id} to={`/distrikt/${district.slug}`} className="district-card">
                <OriginalImage
                  src={district.image_url}
                  alt={districtDisplayName(district)}
                  className="card-image"
                  fallback={district.name}
                />
                <div>
                  <h3>{districtDisplayName(district)}</h3>
                  <p>{excerpt(district.description, 130) || `${municipalities.length} kommuner i distriktet.`}</p>
                  <div className="meta-row">
                    <span>
                      <Map size={15} />
                      {municipalities.length} kommuner
                    </span>
                    <span>
                      <Users size={15} />
                      {people.length} företrädare
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function DistrictDetailPage() {
  const { districtSlug = '' } = useParams();
  const district = districtsBySlug.get(districtSlug);

  if (!district) {
    return <NotFoundBlock />;
  }

  const municipalities = municipalitiesForDistrict(district.id);
  const people = peopleForAssignments(assignmentsForDistrict(district.id));
  const documents = localDocumentsFor(district.id);
  const districtPosts = postsForDistrict(district.id).slice(0, 4);

  return (
    <div className="page-theme local-theme">
      <PageHero
        eyebrow="Distrikt"
        title={districtDisplayName(district)}
        text={district.contact_email || 'Medborgerlig Samling lokalt'}
        image={district.image_url}
        imageAlt={districtDisplayName(district)}
      />
      <section className="content-section split-section">
        <div>
          <SectionIntro title={`MED ${districtDisplayName(district)}`} />
          <HtmlContent html={district.description} />
          <HtmlContent html={district.local_info} />
        </div>
        <aside className="info-panel">
          <h2>Kontakt</h2>
          <div className="info-list">
            {district.contact_email ? (
              <a href={`mailto:${district.contact_email}`}>
                <Mail size={17} />
                {district.contact_email}
              </a>
            ) : null}
            {district.facebook_url ? <ExternalCta href={district.facebook_url}>Facebook</ExternalCta> : null}
            {district.instagram_url ? <ExternalCta href={district.instagram_url}>Instagram</ExternalCta> : null}
            {district.x_url ? <ExternalCta href={district.x_url}>X</ExternalCta> : null}
          </div>
        </aside>
      </section>
      {documents.length ? (
        <section className="content-section">
          <SectionIntro kicker="Dokument" title="Lokala program" />
          <div className="document-list">
            {documents.map((document) => (
              <a key={document.id} href={document.file_url} target="_blank" rel="noreferrer">
                <FileText size={18} />
                <span>{document.title}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
      <section className="content-section">
        <SectionIntro kicker="Kommuner" title="Kommuner i distriktet" />
        <div className="compact-link-grid">
          {municipalities.map((municipality) => (
            <Link key={municipality.id} to={`/distrikt/${district.slug}/${municipality.slug}`}>
              {municipality.display_name || municipality.name}
            </Link>
          ))}
        </div>
      </section>
      {people.length ? (
        <section className="content-section">
          <SectionIntro kicker="Företrädare" title={`Politiker i ${districtDisplayName(district)}`} />
          <div className="person-grid compact">
            {people.map(({ politician, assignment }) => (
              <PersonCard
                key={assignment.id}
                person={politician}
                image={politician.image_url}
                meta={roleText(assignment)}
                to={`/politiker/${politician.slug}`}
              />
            ))}
          </div>
        </section>
      ) : null}
      {districtPosts.length ? (
        <section className="content-section">
          <SectionIntro kicker="Lokalt" title="Aktuellt i distriktet" />
          <div className="card-grid two">
            {districtPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function renderContentBlock(block: MunicipalityContentBlock) {
  const data = block.block_data as { columns?: { title?: string; content?: string; image_url?: string }[] } | null;

  if (data?.columns?.length) {
    return (
      <div className="media-columns">
        {data.columns.map((column, index) => (
          <article key={`${block.id}-${index}`}>
            <OriginalImage src={column.image_url} alt={column.title || 'Lokal bild'} className="card-image" />
            {column.title ? <h3>{column.title}</h3> : null}
            {column.content ? <p>{column.content}</p> : null}
          </article>
        ))}
      </div>
    );
  }

  return (
    <article className="content-block">
      {block.image_url ? (
        <OriginalImage src={block.image_url} alt={block.title || 'Lokal bild'} className="feature-image" />
      ) : null}
      {block.title ? <h2>{block.title}</h2> : null}
      <HtmlContent html={block.content} />
      {block.link_url && block.link_text ? <ExternalCta href={block.link_url}>{block.link_text}</ExternalCta> : null}
    </article>
  );
}

export function MunicipalityDetailPage() {
  const { districtSlug = '', municipalitySlug = '' } = useParams();
  const district = districtsBySlug.get(districtSlug);
  const municipality = district ? municipalitiesBySlug.get(`${district.id}:${municipalitySlug}`) : undefined;

  if (!district || !municipality) {
    return <NotFoundBlock />;
  }

  const people = peopleForAssignments(assignmentsForDistrict(district.id, municipality.id));
  const documents = localDocumentsFor(null, municipality.id);
  const blocks = contentBlocksForMunicipality(municipality.id);

  return (
    <div className="page-theme local-theme">
      <PageHero
        eyebrow={districtDisplayName(district)}
        title={municipality.display_name || municipality.name}
        text={municipality.contact_email || 'Medborgerlig Samling lokalt'}
        image={municipality.image_url || district.image_url}
        imageAlt={municipality.display_name || municipality.name}
      />
      <section className="content-section split-section">
        <div>
          <SectionIntro title={`MED ${municipality.display_name || municipality.name}`} />
          <HtmlContent html={municipality.description || district.description} />
          <HtmlContent html={municipality.local_info} />
        </div>
        <aside className="info-panel">
          <h2>Kontakt</h2>
          <div className="info-list">
            {municipality.contact_email ? (
              <a href={`mailto:${municipality.contact_email}`}>
                <Mail size={17} />
                {municipality.contact_email}
              </a>
            ) : null}
            {municipality.facebook_url ? <ExternalCta href={municipality.facebook_url}>Facebook</ExternalCta> : null}
            {municipality.instagram_url ? <ExternalCta href={municipality.instagram_url}>Instagram</ExternalCta> : null}
          </div>
        </aside>
      </section>
      {blocks.length ? (
        <section className="content-section block-stack">{blocks.map((block) => <div key={block.id}>{renderContentBlock(block)}</div>)}</section>
      ) : null}
      {documents.length ? (
        <section className="content-section">
          <SectionIntro kicker="Dokument" title="Lokala program" />
          <div className="document-list">
            {documents.map((document) => (
              <a key={document.id} href={document.file_url} target="_blank" rel="noreferrer">
                <FileText size={18} />
                <span>{document.title}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}
      {people.length ? (
        <section className="content-section">
          <SectionIntro kicker="Företrädare" title="Lokala politiker" />
          <div className="person-grid compact">
            {people.map(({ politician, assignment }) => (
              <PersonCard
                key={assignment.id}
                person={politician}
                image={politician.image_url}
                meta={roleText(assignment)}
                to={`/politiker/${politician.slug}`}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function EventsPage() {
  const hero = heroFor('evenemang');
  const pastEvents = eventPosts.filter((post) => !upcomingEvents.includes(post)).slice(0, 12);

  return (
    <div className="page-theme events-theme">
      <PageHero
        eyebrow="Evenemang"
        title="Träffa Medborgerlig Samling"
        text="Möten, pubar, föredrag och lokala aktiviteter från originalets publicerade evenemang."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Evenemang'}
      />
      <section className="content-section">
        <SectionIntro kicker="Kommande" title="Nästa tillfällen" />
        <div className="card-grid two">
          {upcomingEvents.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
      {pastEvents.length ? (
        <section className="content-section">
          <SectionIntro kicker="Tidigare" title="Senaste genomförda" />
          <div className="card-grid three">
            {pastEvents.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function AktuelltPage() {
  const hero = heroFor('aktuellt');

  return (
    <div className="page-theme news-theme">
      <PageHero
        eyebrow="Aktuellt"
        title="Nyheter och pressmeddelanden"
        text="Publicerade nyheter och pressmeddelanden från originalets inläggsdata."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Aktuellt'}
      />
      <section className="content-section">
        <div className="card-grid two">
          {latestNews.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function PostDetailPage({ kind }: { kind: 'event' | 'news' }) {
  const { slug = '' } = useParams();
  const post = publishedPosts.find((item) => item.slug === slug);

  if (!post || (kind === 'event' && post.type !== 'evenemang') || (kind === 'news' && post.type === 'evenemang')) {
    return <NotFoundBlock />;
  }

  const location = post.location ? locationsById.get(post.location) : undefined;

  return (
    <>
      <PageHero
        eyebrow={actionText(post)}
        title={post.name}
        text={post.seo?.description || excerpt(post.description, 220)}
        image={post.image}
        imageAlt={post.image_text || post.name}
      />
      <section className="content-section split-section">
        <article className="article-layout">
          <HtmlContent html={post.description} />
          {post.link ? <ExternalCta href={post.link}>Läs mer</ExternalCta> : null}
        </article>
        <aside className="info-panel">
          <h2>Detaljer</h2>
          <div className="info-list">
            {post.start_date ? (
              <span>
                <CalendarDays size={17} />
                {formatDate(post.start_date)} {formatTime(post.start_date)}
              </span>
            ) : null}
            {location ? (
              <span>
                <MapPin size={17} />
                {[location.name, location.address, location.city].filter(Boolean).join(', ')}
              </span>
            ) : null}
            {post.organizer ? (
              <span>
                <Users size={17} />
                {post.organizer}
              </span>
            ) : null}
          </div>
        </aside>
      </section>
    </>
  );
}

export function AboutPage() {
  const hero = heroFor('about');
  const whyMed = tables.why_med_section.find((section) => section.is_active);
  const metrics = tables.party_growth_metrics;

  return (
    <>
      <PageHero
        eyebrow="Om MED"
        title="Sveriges enda frihetliga höger"
        text="Medborgerlig Samling är omstartspartiet för medborgare som vill se ett tryggt, fritt och ansvarstagande Sverige."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Om Medborgerlig Samling'}
      />
      <section className="content-section split-section">
        <div>
          <SectionIntro title={whyMed?.title || 'Varför MED?'} />
          <HtmlContent html={whyMed?.content} />
        </div>
        <div className="timeline-panel">
          {metrics.map((metric) => (
            <div key={metric.id}>
              <span>{metric.year}</span>
              <p>
                {metric.mandates} mandat i {metric.municipalities} kommuner
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function LeaderWordPage() {
  const leader = tables.presidents.find((president) => president.position === 'Ordförande') ?? tables.presidents[0];

  if (!leader) {
    return <NotFoundBlock />;
  }

  return (
    <>
      <PageHero
        eyebrow="Partiledaren har ordet"
        title={leader.name}
        text={leader.slogan || undefined}
        image={leader.hero_image_url || leader.image_url}
        imageAlt={imageAltForPerson(leader.name)}
      />
      <section className="content-section article-layout">
        <HtmlContent html={leader.text_1} />
        <HtmlContent html={leader.text_2} />
      </section>
    </>
  );
}

export function PressPage() {
  const hero = heroFor('press');
  const pressPosts = latestNews.filter((post) => post.type === 'pressmeddelande');

  return (
    <>
      <PageHero
        eyebrow="Press"
        title="Presskontakt och pressmeddelanden"
        text="Kontakta Medborgerlig Samlings pressavdelning för pressfrågor och intervjuer."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Press'}
      />
      <section className="content-section split-section">
        <div className="statement-panel">
          <Newspaper size={34} />
          <h2>Pressfrågor</h2>
          <p>För intervjuer, kommentarer och pressrelaterade frågor.</p>
          <a href="mailto:press@med.se" className="cta-link">
            <Mail size={18} />
            press@med.se
          </a>
        </div>
        <div>
          <SectionIntro title="Senaste pressmeddelanden" />
          <div className="stack-list">
            {pressPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function PodcastPage() {
  const episodes = tables.podcast_episodes_cache.slice(0, 12);

  return (
    <>
      <PageHero
        eyebrow="Alla ska MED"
        title="Alla ska MED"
        text="En podcast av och med politiker och aktivister inom Medborgerlig Samling."
        image="https://www.med.se/images/podcast-hero-bg.jpg"
        imageAlt="Alla ska MED podcast"
        actions={<ExternalCta href="https://feeds.captivate.fm/allaskamed">RSS-flöde</ExternalCta>}
      />
      <section className="content-section">
        <div className="episode-list">
          {episodes.map((episode) => (
            <article key={episode.id} className="episode-card">
              <OriginalImage src={episode.image_url} alt={episode.title} className="episode-image" fallback="MED" />
              <div>
                <p className="kicker">{formatDate(episode.pub_date)}</p>
                <h3>{episode.title}</h3>
                <p>{excerpt(episode.description, 170)}</p>
                {episode.audio_url ? (
                  <audio controls preload="none" src={episode.audio_url}>
                    <a href={episode.audio_url}>Lyssna på avsnittet</a>
                  </audio>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function GranskningPage() {
  return (
    <>
      <PageHero
        eyebrow="Granskningsgruppen"
        title="Granskningar av makt och slöseri"
        text="MED:s granskningar, bakgrundstexter och dokumentlänkar från originalets granskningstabeller."
        image={heroFor('aktuellt')?.image_url}
        imageAlt="Granskningsgruppen"
      />
      <section className="content-section">
        <div className="block-stack">
          {tables.granskningar
            .filter((item) => item.is_published)
            .map((item) => {
              const links = tables.granskning_links.filter((link) => link.granskning_id === item.id);
              return (
                <article key={item.id} className="review-block">
                  <p className="kicker">Granskning {item.order_index + 1}</p>
                  <h2>{item.title}</h2>
                  <HtmlContent html={item.bakgrund} />
                  <HtmlContent html={item.insats} />
                  <div className="document-list">
                    {links.map((link) => (
                      <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
                        <FileText size={18} />
                        {link.title}
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
        </div>
      </section>
    </>
  );
}

export function DonatePage() {
  const hero = heroFor('donera');

  return (
    <>
      <PageHero
        eyebrow="Donera"
        title="Stöd förändring på riktigt"
        text="MED finansieras av medlemmar och sympatisörer. Varje bidrag hjälper partiet att nå fler väljare."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Donera'}
      />
      <section className="content-section split-section">
        <div className="statement-panel">
          <HandCoins size={34} />
          <h2>Swish</h2>
          <p>Skanna QR-koden eller använd partiets ordinarie gåvokanaler.</p>
          <OriginalImage
            src="https://www.med.se/assets/swish-qr-code-D8G03cxk.png"
            alt="Swish QR-kod"
            className="qr-image"
            fallback="QR"
          />
        </div>
        <div>
          <SectionIntro title="Ditt stöd gör skillnad" />
          <p>
            Bidrag används till kampanjer, material, digital närvaro och lokala aktiviteter. Donera bara med egna medel
            och enligt gällande regler för partistöd.
          </p>
          <CtaLink to="/medlemskap">Bli medlem istället</CtaLink>
        </div>
      </section>
    </>
  );
}

export function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Medlemskap"
        title="Bli medlem i Medborgerlig Samling"
        text="Som medlem stärker du partiet och kan påverka den politiska riktningen lokalt och nationellt."
        image={heroFor('home')?.image_url}
        imageAlt="Bli medlem"
      />
      <section className="content-section split-section">
        <div>
          <SectionIntro title="Var med och bygg MED" />
          <p>
            Medlemmarna är partiets ryggrad. De finansierar verksamheten, driver lokalt arbete och gör det möjligt att
            möta väljare över hela landet.
          </p>
          <a href="mailto:medlem@med.se" className="cta-link">
            <Mail size={18} />
            medlem@med.se
          </a>
        </div>
        <div className="statement-panel">
          <Users size={34} />
          <h2>Lokalt engagemang</h2>
          <p>Hitta ditt distrikt och kontakta MED där du bor.</p>
          <CtaLink to="/distrikt">Hitta distrikt</CtaLink>
        </div>
      </section>
    </>
  );
}

export function KommunobligationerPage() {
  const hero = heroFor('kommunobligationer');

  return (
    <>
      <PageHero
        eyebrow="Kommunobligationer"
        title="Granska kommunens skuldsättning"
        text="En temapage om kommunal ekonomi och medborgarnas rätt att förstå hur offentliga pengar används."
        image={hero?.image_url}
        imageAlt={hero?.alt_text || 'Kommunobligationer'}
      />
      <section className="content-section split-section">
        <div>
          <SectionIntro title="Ekonomiskt ansvar börjar lokalt" />
          <p>
            MED vill se tydligare ansvar för kommunala beslut, minskat slöseri och bättre insyn i hur kommuner finansierar
            investeringar och drift.
          </p>
        </div>
        <div className="statement-panel">
          <Landmark size={34} />
          <h2>Ansvar före prestige</h2>
          <p>Offentliga investeringar ska tåla granskning och finansieras med respekt för skattebetalarna.</p>
        </div>
      </section>
    </>
  );
}

export function FreeStudentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Fria studenter"
        title="Fria studenter"
        text="Studentengagemang för frihet, ansvar och öppen debatt."
        image={heroFor('about')?.image_url}
        imageAlt="Fria studenter"
      />
      <section className="content-section split-section">
        <div className="statement-panel">
          <Gavel size={34} />
          <h2>Fri debatt</h2>
          <p>Universitet och högskolor ska präglas av bildning, vetenskap och respekt för åsiktsfrihet.</p>
        </div>
        <div>
          <SectionIntro title="Engagera dig" />
          <p>MED:s studentverksamhet samlar studenter som vill försvara frihetliga värden i akademin.</p>
          <CtaLink to="/politik/universitet">Läs vår högskolepolitik</CtaLink>
        </div>
      </section>
    </>
  );
}

export function LegalPage({ page }: { page: 'integritetspolicy' | 'cookiepolicy' }) {
  const sections = tables.site_content.filter((section) => section.page === page);
  const title = page === 'integritetspolicy' ? 'Integritetspolicy' : 'Cookiepolicy';

  return (
    <>
      <PageHero
        eyebrow="Juridiskt"
        title={title}
        text="Texten kommer från originalets publicerade sidinnehåll."
        image={heroFor('about')?.image_url}
        imageAlt={title}
      />
      <section className="content-section article-layout">
        {page === 'cookiepolicy' ? (
          <button type="button" className="secondary-button policy-settings-button" onClick={openCookieSettings}>
            Öppna cookieinställningar
          </button>
        ) : null}
        {sections.map((section) => (
          <article key={section.id}>
            <h2>{section.title}</h2>
            <HtmlContent html={section.content} />
          </article>
        ))}
      </section>
    </>
  );
}

export function SourcePage() {
  return (
    <section className="plain-page">
      <div className="narrow">
        <p className="kicker">Datakälla</p>
        <h1>Exporterad från med.se</h1>
        <p>Snapshot: {siteSource.exportedAt ? formatDate(siteSource.exportedAt) : 'saknas'}</p>
        <p>Bundle: {siteSource.bundleUrl}</p>
      </div>
    </section>
  );
}

export function RedirectToPolitics() {
  return <Navigate to="/politik" replace />;
}

export function RedirectToPost() {
  const first = latestNews[0] ?? publishedPosts[0];
  return <Navigate to={first ? postUrl(first) : '/aktuellt'} replace />;
}
