import { rewriteUrl } from "./router.js";
import { clearRedirects, shouldRedirect } from "./redirect-guard.js";
import { getEnabled, setEnabled } from "./enabled-state.js";
import { isSiteEnabled } from "./site-settings.js";
const ENABLED_KEY = "enabled";
let badgeTimer;

async function showRedirectBadge() {
  await chrome.action.setBadgeText({ text: "→" });
  globalThis.clearTimeout(badgeTimer);
  badgeTimer = globalThis.setTimeout(() => {
    chrome.action.setBadgeText({ text: "" });
  }, 1000);
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
  const enabled = await getEnabled();
  await setEnabled(enabled);
  await updateAction(enabled);
});

chrome.runtime.onStartup.addListener(async () => {
  await updateAction(await getEnabled());
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if ((areaName === "sync" || areaName === "local") && changes[ENABLED_KEY]) {
    await updateAction(await getEnabled());
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  clearRedirects(tabId);
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-enabled") {
    const enabled = !(await getEnabled());
    await setEnabled(enabled);
    await updateAction(enabled);
  }
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
  if (details.frameId !== 0 || !(await getEnabled())) {
    return;
  }

  const targetUrl = rewriteUrl(details.url, {
    siteEnabled: await isSiteEnabled(new URL(details.url).hostname),
  });
  if (
    targetUrl &&
    targetUrl !== details.url &&
    shouldRedirect(details.tabId, details.url, targetUrl)
  ) {
    await chrome.tabs.update(details.tabId, { url: targetUrl });
    await showRedirectBadge();
  }
});
