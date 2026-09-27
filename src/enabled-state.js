import { getSetting, setSetting } from "./storage.js";

const ENABLED_KEY = "enabled";
const DEFAULT_ENABLED = true;
let cachedEnabled;

chrome.storage.onChanged.addListener((changes) => {
  if (changes[ENABLED_KEY]) {
    cachedEnabled = undefined;
  }
});

export async function getEnabled() {
  if (typeof cachedEnabled === "boolean") {
    return cachedEnabled;
  }

  cachedEnabled = (await getSetting(ENABLED_KEY, DEFAULT_ENABLED)) === true;
  return cachedEnabled;
}

export async function setEnabled(enabled) {
  await setSetting(ENABLED_KEY, enabled);
  cachedEnabled = enabled;
}
