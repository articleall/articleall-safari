import { rewriteUrl } from "./router.js";
import { clearRedirects, shouldRedirect } from "./redirect-guard.js";

const ENABLED_KEY = "enabled";
const DEFAULT_ENABLED = true;

async function getEnabled() {
  const values = await chrome.storage.sync.get({ [ENABLED_KEY]: DEFAULT_ENABLED });
  return values[ENABLED_KEY] === true;
}

async function updateAction(enabled) {
  await chrome.action.setBadgeText({ text: enabled ? "" : "OFF" });
  await chrome.action.setBadgeBackgroundColor({ color: "#64748b" });
  await chrome.action.setIcon({
    path: enabled
      ? { 16: "icons/icon16.png", 32: "icons/icon32.png" }
      : { 16: "icons/disabled16.png", 32: "icons/disabled32.png" },
  });
  await chrome.action.setTitle({
    title: enabled ? "Articleall (enabled)" : "Articleall (disabled)",
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const values = await chrome.storage.sync.get(ENABLED_KEY);
  if (typeof values[ENABLED_KEY] !== "boolean") {
    await chrome.storage.sync.set({ [ENABLED_KEY]: DEFAULT_ENABLED });
  }
  await updateAction(
    typeof values[ENABLED_KEY] === "boolean"
      ? values[ENABLED_KEY]
      : DEFAULT_ENABLED,
  );
});

chrome.runtime.onStartup.addListener(async () => {
  await updateAction(await getEnabled());
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === "sync" && changes[ENABLED_KEY]) {
    await updateAction(changes[ENABLED_KEY].newValue === true);
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  clearRedirects(tabId);
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0 || !(await getEnabled())) {
    return;
  }

  const targetUrl = rewriteUrl(details.url);
  if (
    targetUrl &&
    targetUrl !== details.url &&
    shouldRedirect(details.tabId, details.url, targetUrl)
  ) {
    await chrome.tabs.update(details.tabId, { url: targetUrl });
  }
});
