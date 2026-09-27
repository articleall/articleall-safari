const enabledInput = document.querySelector("#enabled");
const status = document.querySelector("#status");
const error = document.querySelector("#error");
const ENABLED_KEY = "enabled";
const id = navigator.language.toLowerCase().startsWith("id");
const text = id ? { subtitle: "Artikel satu halaman", global: "Pengalihan otomatis", enabled: "Aktif", disabled: "Nonaktif", unavailable: "Tidak tersedia", error: "Tidak dapat memuat pengaturan.", siteSettings: "Pengaturan situs" } : { subtitle: "Full-page articles", global: "Auto-redirect", enabled: "Enabled", disabled: "Disabled", unavailable: "Unavailable", error: "Unable to load settings.", siteSettings: "Site settings" };
document.querySelector("#subtitle").textContent = text.subtitle;
document.querySelector("#toggle-label").textContent = text.global;
document.querySelector("#site-settings").textContent = text.siteSettings;
document.querySelector("#site-settings").addEventListener("click", (event) => { event.preventDefault(); chrome.runtime.openOptionsPage(); });

function showState(enabled) {
  enabledInput.checked = enabled;
  status.textContent = enabled ? text.enabled : text.disabled;
}

function showError(message) {
  error.hidden = false;
  error.textContent = message;
  enabledInput.disabled = true;
  status.textContent = text.unavailable;
}

chrome.storage.sync
  .get({ [ENABLED_KEY]: true })
  .then((values) => showState(values[ENABLED_KEY] === true))
  .catch(() => showError(text.error));

enabledInput.addEventListener("change", () => {
  const enabled = enabledInput.checked;
  chrome.storage.sync
    .set({ [ENABLED_KEY]: enabled })
    .then(() => showState(enabled))
    .catch(() => {
      showState(!enabled);
      showError(text.error);
    });
});
