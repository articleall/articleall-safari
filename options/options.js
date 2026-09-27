import { getEnabled, setEnabled } from "../src/enabled-state.js";
import { getAllSites, setSiteEnabled } from "../src/site-settings.js";

const id = navigator.language.toLowerCase().startsWith("id");
const text = id ? { settings: "Pengaturan", global: "Pengalihan otomatis", sites: "Situs yang didukung", enabled: "Aktif", disabled: "Nonaktif", back: "Kembali ke Articleall", error: "Tidak dapat memuat pengaturan." } : { settings: "Settings", global: "Auto-redirect", sites: "Supported sites", enabled: "Enabled", disabled: "Disabled", back: "Back to Articleall", error: "Unable to load settings." };
document.querySelector("#subtitle").textContent = text.settings;
document.querySelector("#global-label").textContent = text.global;
document.querySelector("#sites-heading").textContent = text.sites;
document.querySelector("#back").textContent = text.back;
const enabledInput = document.querySelector("#enabled");
const status = document.querySelector("#global-status");
const sitesElement = document.querySelector("#sites");
function showGlobal(enabled) { enabledInput.checked = enabled; status.textContent = enabled ? text.enabled : text.disabled; }
function showError() { const error = document.querySelector("#error"); error.hidden = false; error.textContent = text.error; }
try {
  showGlobal(await getEnabled());
  for (const site of await getAllSites()) {
    const row = document.createElement("label");
    row.className = "site";
    row.innerHTML = `<span><strong>${site.label}</strong><span class="site-domain">${site.domain}</span></span><span class="switch"><input type="checkbox" ${site.enabled ? "checked" : ""}><span class="slider" aria-hidden="true"></span></span>`;
    row.querySelector("input").addEventListener("change", async (event) => {
      try {
        await setSiteEnabled(site.domain, event.target.checked);
      } catch {
        event.target.checked = !event.target.checked;
        showError();
      }
    });
    sitesElement.append(row);
  }
} catch { showError(); }
enabledInput.addEventListener("change", async () => { try { await setEnabled(enabledInput.checked); showGlobal(enabledInput.checked); } catch { showError(); } });
