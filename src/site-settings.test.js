import assert from "node:assert/strict";
import { test } from "node:test";

function mockChrome(values = {}) {
  const listeners = [];
  let stored = { ...values };
  return {
    storage: {
      sync: {
        get: async (defaults) => ({ ...defaults, ...stored }),
        set: async (next) => { stored = { ...stored, ...next }; },
      },
      local: { get: async (defaults) => defaults, set: async () => {} },
      onChanged: { addListener: (listener) => listeners.push(listener) },
    },
    notify(changes) {
      for (const [key, change] of Object.entries(changes)) {
        stored[key] = change.newValue;
      }
      for (const listener of listeners) listener(changes, "sync");
    },
  };
}

test("site settings expose all rule domains enabled by default", async () => {
  globalThis.chrome = mockChrome();
  const settings = await import(`./site-settings.js?test=${Date.now()}-1`);
  const sites = await settings.getAllSites();
  assert.equal(sites.length, 31);
  assert.equal(sites.find((site) => site.domain === "kompas.com").enabled, true);
});

test("site overrides persist and invalidate cached values", async () => {
  const chrome = mockChrome();
  globalThis.chrome = chrome;
  const settings = await import(`./site-settings.js?test=${Date.now()}-2`);
  await settings.setSiteEnabled("kompas.com", false);
  assert.equal(await settings.isSiteEnabled("kompas.com"), false);
  chrome.notify({ siteOverrides: { newValue: { "kompas.com": true } } });
  assert.equal(await settings.isSiteEnabled("kompas.com"), true);
});
