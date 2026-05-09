const CATALOG_REFRESH_EVENT = "mevaq:catalog-refresh";
const SITE_SETTINGS_REFRESH_EVENT = "mevaq:site-settings-refresh";

type RefreshEventName = typeof CATALOG_REFRESH_EVENT | typeof SITE_SETTINGS_REFRESH_EVENT;

function emitRefresh(eventName: RefreshEventName) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(eventName));
}

function onRefresh(eventName: RefreshEventName, callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(eventName, callback);
  return () => window.removeEventListener(eventName, callback);
}

export function emitCatalogRefresh() {
  emitRefresh(CATALOG_REFRESH_EVENT);
}

export function onCatalogRefresh(callback: () => void) {
  return onRefresh(CATALOG_REFRESH_EVENT, callback);
}

export function emitSiteSettingsRefresh() {
  emitRefresh(SITE_SETTINGS_REFRESH_EVENT);
}

export function onSiteSettingsRefresh(callback: () => void) {
  return onRefresh(SITE_SETTINGS_REFRESH_EVENT, callback);
}
