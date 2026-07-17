import assert from "node:assert/strict";
import test from "node:test";

import { getLoaderReleaseTime, LOADER_MAX_MS, LOADER_MIN_MS } from "./portfolio-loader.ts";

test("holds a ready hero until the minimum editorial sequence completes", () => {
  const startedAt = 10_000;

  assert.equal(getLoaderReleaseTime(startedAt, startedAt + 300), startedAt + LOADER_MIN_MS);
});

test("releases immediately when readiness arrives after the minimum", () => {
  const startedAt = 10_000;
  const readyAt = startedAt + 1_600;

  assert.equal(getLoaderReleaseTime(startedAt, readyAt), readyAt);
});

test("caps a late or missing readiness signal at the safety timeout", () => {
  const startedAt = 10_000;

  assert.equal(getLoaderReleaseTime(startedAt, null), startedAt + LOADER_MAX_MS);
  assert.equal(getLoaderReleaseTime(startedAt, startedAt + 5_000), startedAt + LOADER_MAX_MS);
});
