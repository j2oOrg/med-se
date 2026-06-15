export const openCookieSettingsEvent = 'med:open-cookie-settings';

export function openCookieSettings() {
  window.dispatchEvent(new Event(openCookieSettingsEvent));
}
