import assert from "node:assert/strict";
import { test } from "node:test";

function createStorageMock({ syncGet, syncSet, localGet, localSet } = {}) {
  const listeners = [];
  return {
    storage: {
      sync: {
        get: syncGet ?? (async (defaults) => defaults),
        set: syncSet ?? (async () => {}),
      },
      local: {
        get: localGet ?? (async (defaults) => defaults),
        set: localSet ?? (async () => {}),
      },
      onChanged: {
        addListener(listener) {
          listeners.push(listener);
        },
      },
    },
    notify(changes, areaName) {
      for (const listener of listeners) {
        listener(changes, areaName);
      }
    },
  };
}

async function loadModules(storage) {
  globalThis.chrome = storage;
  const suffix = `?test=${Date.now()}-${Math.random()}`;
  return {
    storage: await import(`./storage.js${suffix}`),
    enabledState: await import(`./enabled-state.js${suffix}`),
  };
}

test("storage falls back to local storage when sync get fails", async () => {
  const chrome = createStorageMock({
    syncGet: async () => {
      throw new Error("sync unavailable");
    },
    localGet: async () => ({ enabled: false }),
  });
  const { storage } = await loadModules(chrome);

  assert.equal(await storage.getSetting("enabled", true), false);
});

test("storage falls back to local storage when sync set fails", async () => {
  let localValue;
  const chrome = createStorageMock({
    syncSet: async () => {
      throw new Error("sync quota exceeded");
    },
    localSet: async (values) => {
      localValue = values.enabled;
    },
  });
  const { storage } = await loadModules(chrome);

  await storage.setSetting("enabled", false);
  assert.equal(localValue, false);
});

test("enabled state caches reads and invalidates on storage changes", async () => {
  let reads = 0;
  const chrome = createStorageMock({
    syncGet: async () => {
      reads += 1;
      return { enabled: true };
    },
  });
  const { enabledState } = await loadModules(chrome);

  assert.equal(await enabledState.getEnabled(), true);
  assert.equal(await enabledState.getEnabled(), true);
  assert.equal(reads, 1);

  chrome.notify({ enabled: { newValue: false } }, "sync");
  assert.equal(await enabledState.getEnabled(), true);
  assert.equal(reads, 2);

  await enabledState.setEnabled(false);
  assert.equal(await enabledState.getEnabled(), false);
  assert.equal(reads, 2);
});
