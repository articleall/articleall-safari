import assert from "node:assert/strict";
import test from "node:test";
import { rewriteUrl } from "./router.js";

test("adds page=all and preserves existing query and hash", () => {
  assert.equal(
    rewriteUrl("https://nasional.kompas.com/read/123?utm_source=x#comments"),
    "https://nasional.kompas.com/read/123?utm_source=x&page=all#comments",
  );
});

test("does not redirect when the target query key already exists", () => {
  assert.equal(rewriteUrl("https://suara.com/news?page=1"), null);
  assert.equal(rewriteUrl("https://detik.com/read?single"), null);
});

test("uses site-specific query keys", () => {
  assert.equal(
    rewriteUrl("https://news.sindonews.com/read/1"),
    "https://news.sindonews.com/read/1?showpage=all",
  );
  assert.equal(
    rewriteUrl("https://www.poskota.co.id/read/1?x=1"),
    "https://www.poskota.co.id/read/1?x=1&view=all",
  );
  assert.equal(
    rewriteUrl("https://insidermonkey.com/read/1"),
    "https://insidermonkey.com/read/1?singlepage=1",
  );
});

test("adds a slash before query for slash-query sites", () => {
  assert.equal(
    rewriteUrl("https://www.jawapos.com/read/1?utm=1"),
    "https://www.jawapos.com/read/1/?utm=1&page=all",
  );
  assert.equal(
    rewriteUrl("https://beritasatu.com/read/1/"),
    "https://beritasatu.com/read/1/?view=all",
  );
});

test("adds and detects path suffixes without duplicate slashes", () => {
  assert.equal(
    rewriteUrl("https://www.inews.id/read/1/"),
    "https://www.inews.id/read/1/all",
  );
  assert.equal(rewriteUrl("https://www.inews.id/read/1/all"), null);
  assert.equal(
    rewriteUrl("https://wahananews.co/read/1?x=1"),
    "https://wahananews.co/read/1/0?x=1",
  );
  assert.equal(rewriteUrl("https://wahananews.co/read/1/0"), null);
});

test("ignores unsupported, invalid, and non-web URLs", () => {
  assert.equal(rewriteUrl("https://example.com/article"), null);
  assert.equal(rewriteUrl("chrome://extensions"), null);
  assert.equal(rewriteUrl("not a url"), null);
});
