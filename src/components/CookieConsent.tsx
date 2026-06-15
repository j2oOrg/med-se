import { useEffect, useState } from 'react';
import { Settings, X } from 'lucide-react';
import {
  allCookiePreferences,
  necessaryOnlyPreferences,
  readCookiePreferences,
  saveCookiePreferences,
  trackEvent,
  type CookiePreferences,
} from '../lib/analytics';
import { openCookieSettingsEvent } from '../lib/cookie-settings';

function initialPreferences() {
  return readCookiePreferences() ?? necessaryOnlyPreferences();
}

export function CookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>(initialPreferences);
  const [showBanner, setShowBanner] = useState(() => !readCookiePreferences());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    function handleOpenSettings() {
      setShowSettings(true);
      setShowBanner(false);
    }

    window.addEventListener(openCookieSettingsEvent, handleOpenSettings);
    return () => window.removeEventListener(openCookieSettingsEvent, handleOpenSettings);
  }, []);

  function commitPreferences(next: CookiePreferences) {
    saveCookiePreferences(next);
    setPreferences(next);
    setShowBanner(false);
    setShowSettings(false);
    trackEvent('cookie_preferences_saved', {
      analytics: next.analytics,
      marketing: next.marketing,
    });
  }

  function updatePreference(field: 'analytics' | 'marketing', value: boolean) {
    setPreferences((current) => ({
      ...current,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  }

  return (
    <>
      {showBanner ? (
        <aside className="cookie-banner" aria-label="Cookie-samtycke">
          <div>
            <p className="kicker">Cookies</p>
            <h2>Vi använder cookies med ditt samtycke</h2>
            <p>
              Nödvändiga cookies krävs för att webbplatsen ska fungera. Analys och marknadsföring aktiveras bara om du
              väljer det.
            </p>
          </div>
          <div className="cookie-actions">
            <button type="button" className="cta-link" onClick={() => commitPreferences(allCookiePreferences())}>
              Acceptera alla
            </button>
            <button type="button" className="secondary-button" onClick={() => commitPreferences(necessaryOnlyPreferences())}>
              Endast nödvändiga
            </button>
            <button type="button" className="text-button" onClick={() => setShowSettings(true)}>
              Anpassa
            </button>
          </div>
        </aside>
      ) : null}

      {showSettings ? (
        <div className="cookie-dialog-backdrop" role="presentation">
          <section
            className="cookie-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-dialog-title"
          >
            <button
              type="button"
              className="dialog-close"
              aria-label="Stäng cookie-inställningar"
              onClick={() => setShowSettings(false)}
            >
              <X size={20} />
            </button>
            <Settings size={28} />
            <p className="kicker">Cookieinställningar</p>
            <h2 id="cookie-dialog-title">Välj vilka cookies MED får använda</h2>
            <div className="cookie-option">
              <div>
                <h3>Nödvändiga cookies</h3>
                <p>Krävs för grundläggande funktioner och kan inte stängas av.</p>
              </div>
              <span>Alltid aktiva</span>
            </div>
            <label className="cookie-option">
              <div>
                <h3>Analytiska cookies</h3>
                <p>Hjälper oss förstå hur webbplatsen används. Respekterar Do Not Track.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(event) => updatePreference('analytics', event.target.checked)}
              />
            </label>
            <label className="cookie-option">
              <div>
                <h3>Marknadsföringscookies</h3>
                <p>Används bara för kampanjmätning om sådana verktyg aktiveras.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(event) => updatePreference('marketing', event.target.checked)}
              />
            </label>
            <div className="cookie-dialog-actions">
              <button type="button" className="secondary-button" onClick={() => commitPreferences(necessaryOnlyPreferences())}>
                Spara nödvändiga
              </button>
              <button type="button" className="cta-link" onClick={() => commitPreferences(preferences)}>
                Spara val
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
