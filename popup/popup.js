const enabledInput = document.querySelector("#enabled");
const status = document.querySelector("#status");
const error = document.querySelector("#error");
const ENABLED_KEY = "enabled";

function showState(enabled) {
  enabledInput.checked = enabled;
  status.textContent = enabled ? "Enabled" : "Disabled";
}

function showError(message) {
  error.hidden = false;
  error.textContent = message;
  enabledInput.disabled = true;
  status.textContent = "Unavailable";
}

chrome.storage.sync
  .get({ [ENABLED_KEY]: true })
  .then((values) => showState(values[ENABLED_KEY] === true))
  .catch(() => showError("Unable to load settings."));

enabledInput.addEventListener("change", () => {
  const enabled = enabledInput.checked;
  chrome.storage.sync
    .set({ [ENABLED_KEY]: enabled })
    .then(() => showState(enabled))
    .catch(() => {
      showState(!enabled);
      showError("Unable to save settings.");
    });
});
