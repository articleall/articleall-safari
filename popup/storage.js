export async function getSetting(key, defaultValue) {
  try {
    const values = await chrome.storage.sync.get({ [key]: defaultValue });
    return values[key] ?? defaultValue;
  } catch {
    const values = await chrome.storage.local.get({ [key]: defaultValue });
    return values[key] ?? defaultValue;
  }
}

export async function setSetting(key, value) {
  try {
    await chrome.storage.sync.set({ [key]: value });
  } catch {
    await chrome.storage.local.set({ [key]: value });
  }
}
