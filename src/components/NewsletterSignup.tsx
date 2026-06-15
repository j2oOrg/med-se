import { useId, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

type SignupState = {
  firstName: string;
  lastName: string;
  email: string;
  newsletterConsent: boolean;
  privacyConsent: boolean;
};

type NewsletterSignupProps = {
  className?: string;
  compact?: boolean;
};

const initialState: SignupState = {
  firstName: '',
  lastName: '',
  email: '',
  newsletterConsent: false,
  privacyConsent: false,
};

export function NewsletterSignup({ className = '', compact = false }: NewsletterSignupProps) {
  const id = useId();
  const [form, setForm] = useState<SignupState>(initialState);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function updateField(field: keyof SignupState, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.newsletterConsent || !form.privacyConsent) {
      setStatus('error');
      setMessage('Du behöver godkänna båda samtyckena för att prenumerera.');
      return;
    }

    setStatus('submitting');
    setMessage('');
    trackEvent('newsletter_signup_submit', { source: compact ? 'footer' : 'home' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const result = (await response.json().catch(() => null)) as { configured?: boolean } | null;

      if (!response.ok || result?.configured === false) {
        throw new Error('Newsletter request failed');
      }

      setStatus('success');
      setMessage('Tack. Du kommer att få Daniels viktigaste uppdateringar via e-post.');
      setForm(initialState);
      trackEvent('newsletter_signup_success', { source: compact ? 'footer' : 'home' });
    } catch {
      setStatus('error');
      setMessage('Det gick inte att skicka anmälan just nu. Försök igen senare.');
    }
  }

  return (
    <section className={`newsletter-section ${compact ? 'newsletter-compact' : ''} ${className}`}>
      <div className="newsletter-copy">
        <p className="kicker">Nyhetsbrev</p>
        <h2>Följ vägen till riksdagen 2026</h2>
        <p>Prenumerera på Daniels nyhetsbrev och få MED:s viktigaste uppdateringar direkt i inboxen.</p>
      </div>
      <form className="newsletter-form" onSubmit={submitSignup}>
        <div className="newsletter-icon" aria-hidden="true">
          <MailCheck size={28} />
        </div>
        <div className="form-grid">
          <label>
            <span>Förnamn</span>
            <input
              id={`${id}-first-name`}
              value={form.firstName}
              onChange={(event) => updateField('firstName', event.target.value)}
              autoComplete="given-name"
              required
            />
          </label>
          <label>
            <span>Efternamn</span>
            <input
              id={`${id}-last-name`}
              value={form.lastName}
              onChange={(event) => updateField('lastName', event.target.value)}
              autoComplete="family-name"
              required
            />
          </label>
        </div>
        <label>
          <span>E-post</span>
          <input
            id={`${id}-email`}
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="consent-row">
          <input
            type="checkbox"
            checked={form.newsletterConsent}
            onChange={(event) => updateField('newsletterConsent', event.target.checked)}
            required
          />
          <span>Jag vill prenumerera på Daniels nyhetsbrev.</span>
        </label>
        <label className="consent-row">
          <input
            type="checkbox"
            checked={form.privacyConsent}
            onChange={(event) => updateField('privacyConsent', event.target.checked)}
            required
          />
          <span>
            Jag samtycker till behandling av mina uppgifter enligt <Link to="/integritetspolicy">integritetspolicyn</Link>.
          </span>
        </label>
        <button type="submit" className="cta-link" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Skickar...' : 'Prenumerera'}
        </button>
        {message ? <p className={`form-message ${status === 'success' ? 'success' : 'error'}`}>{message}</p> : null}
      </form>
    </section>
  );
}
