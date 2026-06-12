import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteOrigin = 'https://www.med.se';
const bundleUrl = `${siteOrigin}/assets/index-CLFoMEk5.js`;
const outputFile = path.resolve('src/data/med-data.json');

const tableConfigs = {
  districts: { order: 'name.asc' },
  granskningar: { order: 'order_index.asc' },
  granskning_links: { order: 'order_index.asc' },
  hero_images: { order: 'page_slug.asc,created_at.asc' },
  local_documents: { order: 'sort_order.asc,title.asc' },
  locations: { order: 'city.asc,name.asc' },
  municipalities: { order: 'name.asc' },
  municipality_content_blocks: { order: 'sort_order.asc' },
  party_growth_metrics: { order: 'display_order.asc' },
  podcast_episodes_cache: { order: 'pub_date.desc' },
  policies: { order: 'order_index.asc,title.asc' },
  politician_assignments: { order: 'is_leader.desc,role.asc,created_at.asc' },
  politicians: { order: 'name.asc' },
  posts: { order: 'start_date.desc,created_at.desc' },
  presidents: { order: 'created_at.asc' },
  riksdagslista_kandidater: { order: 'position.asc' },
  seo_settings: { order: 'setting_key.asc' },
  site_content: { order: 'page.asc,section_order.asc' },
  site_settings: { order: 'setting_key.asc' },
  spokesperson_images: { order: 'sort_order.asc,created_at.asc' },
  spokespersons: { order: 'political_area.asc,name.asc' },
  testimonials: { order: 'order_index.asc' },
  valloften: { order: 'order_index.asc' },
  why_med_section: { order: 'created_at.asc' },
};

function requireMatch(value, label) {
  if (!value) {
    throw new Error(`Could not find ${label} in the live bundle`);
  }

  return value;
}

function slugify(value) {
  return String(value ?? '')
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

async function getSupabaseConfig() {
  const bundle = await fetch(bundleUrl).then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to fetch bundle: ${response.status}`);
    }

    return response.text();
  });

  const configIndex = bundle.indexOf('.supabase.co');
  const context = bundle.slice(Math.max(0, configIndex - 120), configIndex + 600);
  const url = requireMatch(context.match(/"(https:\/\/[^" ]+\.supabase\.co)"/)?.[1], 'Supabase URL');
  const anonKey = requireMatch(context.match(/"(eyJ[^" ]+)"/)?.[1], 'Supabase anon key');

  return { url, anonKey };
}

async function fetchTable({ url, anonKey }, tableName, { order } = {}) {
  const rows = [];
  const pageSize = 1000;

  for (let offset = 0; ; offset += pageSize) {
    const endpoint = new URL(`${url}/rest/v1/${encodeURIComponent(tableName)}`);
    endpoint.searchParams.set('select', '*');
    endpoint.searchParams.set('limit', String(pageSize));
    endpoint.searchParams.set('offset', String(offset));

    if (order) {
      endpoint.searchParams.set('order', order);
    }

    const response = await fetch(endpoint, {
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`${tableName}: ${response.status} ${message}`);
    }

    const pageRows = await response.json();
    rows.push(...pageRows);

    if (pageRows.length < pageSize) {
      break;
    }
  }

  return rows;
}

function enrichData(tables) {
  const postsBySlug = new Map();
  const posts = tables.posts.map((post) => {
    const baseSlug = slugify(post.name) || `post-${post.id}`;
    const datePart = post.start_date ? post.start_date.slice(0, 10) : post.created_at?.slice(0, 10);
    let slug = baseSlug;

    if (postsBySlug.has(slug)) {
      slug = `${baseSlug}-${slugify(datePart) || String(post.id).slice(0, 8)}`;
    }

    postsBySlug.set(slug, post.id);

    return {
      ...post,
      slug,
    };
  });

  return {
    ...tables,
    posts,
  };
}

async function main() {
  const config = await getSupabaseConfig();
  const tables = {};

  for (const [tableName, tableConfig] of Object.entries(tableConfigs)) {
    tables[tableName] = await fetchTable(config, tableName, tableConfig);
    console.log(`${tableName}: ${tables[tableName].length}`);
  }

  const data = {
    source: {
      siteOrigin,
      bundleUrl,
      exportedAt: new Date().toISOString(),
    },
    tables: enrichData(tables),
  };

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
