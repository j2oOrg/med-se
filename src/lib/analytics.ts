export type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const cookieConsentStorageKey = 'med-cookie-consent-v1';

export function necessaryOnlyPreferences(): CookiePreferences {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString(),
  };
}

export function allCookiePreferences(): CookiePreferences {
  return {
    necessary: true,
    analytics: true,
    marketing: true,
    updatedAt: new Date().toISOString(),
  };
}

export function readCookiePreferences(): CookiePreferences | null {
  try {
    const stored = window.localStorage.getItem(cookieConsentStorageKey);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as Partial<CookiePreferences>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveCookiePreferences(preferences: CookiePreferences) {
  window.localStorage.setItem(cookieConsentStorageKey, JSON.stringify(preferences));
  window.dispatchEvent(
    new CustomEvent('med:cookie-consent-updated', {
      detail: preferences,
    }),
  );
}

export function hasAnalyticsConsent() {
  const preferences = readCookiePreferences();
  const doNotTrack = navigator.doNotTrack === '1';
  return Boolean(preferences?.analytics) && !doNotTrack;
}

export function trackEvent(name: string, detail: Record<string, unknown> = {}) {
  if (!hasAnalyticsConsent()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('med:analytics', {
      detail: {
        name,
        detail,
        timestamp: new Date().toISOString(),
      },
    }),
  );
}
