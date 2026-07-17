import assert from "node:assert/strict";
import test from "node:test";

import { shouldUse3DGallery } from "./gallery-capability.ts";

const capable = {
  viewportWidth: 1440,
  finePointer: true,
  reducedMotion: false,
  saveData: false,
  webgl: true,
  projectCount: 4,
  deviceMemory: 8,
};

test("enables the 3D gallery on a capable desktop", () => {
  assert.equal(shouldUse3DGallery(capable), true);
});

test("keeps the editorial rows for accessibility and constrained-device signals", () => {
  assert.equal(shouldUse3DGallery({ ...capable, viewportWidth: 1023 }), false);
  assert.equal(shouldUse3DGallery({ ...capable, finePointer: false }), false);
  assert.equal(shouldUse3DGallery({ ...capable, reducedMotion: true }), false);
  assert.equal(shouldUse3DGallery({ ...capable, saveData: true }), false);
  assert.equal(shouldUse3DGallery({ ...capable, webgl: false }), false);
  assert.equal(shouldUse3DGallery({ ...capable, projectCount: 0 }), false);
  assert.equal(shouldUse3DGallery({ ...capable, deviceMemory: 2 }), false);
});

test("does not reject a capable browser that omits device-memory information", () => {
  assert.equal(shouldUse3DGallery({ ...capable, deviceMemory: undefined }), true);
});
