import { getSetting, setSetting } from "./storage.js";
import { getTranslations } from "../src/i18n.js";

const enabledInput = document.querySelector("#enabled");
const status = document.querySelector("#status");
const error = document.querySelector("#error");
const ENABLED_KEY = "enabled";
const text = getTranslations();
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

getSetting(ENABLED_KEY, true)
  .then((enabled) => showState(enabled === true))
  .catch(() => showError(text.error));

enabledInput.addEventListener("change", () => {
  const enabled = enabledInput.checked;
  setSetting(ENABLED_KEY, enabled)
    .then(() => showState(enabled))
    .catch(() => {
      showState(!enabled);
      showError(text.error);
    });
});
