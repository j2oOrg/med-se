function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  });
}

function isValidEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitize(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

export async function onRequestPost({ request, env }) {
  let body;

  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const signup = {
    firstName: sanitize(body.firstName, 100),
    lastName: sanitize(body.lastName, 100),
    email: sanitize(body.email, 255).toLowerCase(),
    newsletterConsent: body.newsletterConsent === true,
    privacyConsent: body.privacyConsent === true,
    source: 'med-se-pages',
    submittedAt: new Date().toISOString(),
  };

  if (!signup.firstName || !signup.lastName || !isValidEmail(signup.email)) {
    return json({ ok: false, error: 'invalid_fields' }, { status: 400 });
  }

  if (!signup.newsletterConsent || !signup.privacyConsent) {
    return json({ ok: false, error: 'missing_consent' }, { status: 400 });
  }

  if (env.NEWSLETTER_ENDPOINT) {
    const headers = {
      'content-type': 'application/json',
    };

    if (env.NEWSLETTER_TOKEN) {
      headers.authorization = `Bearer ${env.NEWSLETTER_TOKEN}`;
      headers.apikey = env.NEWSLETTER_TOKEN;
    }

    const response = await fetch(env.NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(signup),
    });

    if (!response.ok) {
      return json({ ok: false, error: 'upstream_failed' }, { status: 502 });
    }

    return json({ ok: true, configured: true });
  }

  if (env.NEWSLETTER_SIGNUPS) {
    const key = `signup:${Date.now()}:${crypto.randomUUID()}`;
    await env.NEWSLETTER_SIGNUPS.put(key, JSON.stringify(signup));
    return json({ ok: true, configured: true, stored: true });
  }

  return json({ ok: false, configured: false, error: 'newsletter_backend_not_configured' }, { status: 503 });
}

export function onRequest() {
  return json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
