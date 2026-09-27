import assert from "node:assert/strict";
import test from "node:test";
import { clearRedirects, shouldRedirect } from "./redirect-guard.js";

test("allows three redirects and blocks the fourth within the time window", () => {
  clearRedirects(1);
  assert.equal(shouldRedirect(1, "https://example.test/1", "https://example.test/2"), true);
  assert.equal(shouldRedirect(1, "https://example.test/2", "https://example.test/3"), true);
  assert.equal(shouldRedirect(1, "https://example.test/3", "https://example.test/4"), true);
  assert.equal(shouldRedirect(1, "https://example.test/4", "https://example.test/5"), false);
});

test("tracks tabs independently and clears a tab", () => {
  clearRedirects(2);
  assert.equal(shouldRedirect(2, "from", "to"), true);
  clearRedirects(2);
  assert.equal(shouldRedirect(2, "from", "to"), true);
});
