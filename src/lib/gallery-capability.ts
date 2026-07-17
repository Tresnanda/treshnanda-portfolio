export type GalleryCapability = {
  viewportWidth: number;
  finePointer: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  webgl: boolean;
  projectCount: number;
  deviceMemory?: number;
};

export function shouldUse3DGallery(capability: GalleryCapability) {
  const hasEnoughMemory = capability.deviceMemory === undefined || capability.deviceMemory >= 4;

  return (
    capability.viewportWidth >= 1024 &&
    capability.finePointer &&
    !capability.reducedMotion &&
    !capability.saveData &&
    capability.webgl &&
    capability.projectCount > 0 &&
    hasEnoughMemory
  );
}
