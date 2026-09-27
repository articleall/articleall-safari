import { getEnabled, setEnabled } from "../src/enabled-state.js";
import { getAllSites, setSiteEnabled } from "../src/site-settings.js";
import { getTranslations } from "../src/i18n.js";

const text = getTranslations();
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
