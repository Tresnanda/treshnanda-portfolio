export const LOADER_MIN_MS = 1_150;
export const LOADER_MAX_MS = 2_500;

export function getLoaderReleaseTime(startedAt: number, readyAt: number | null) {
  const earliestRelease = startedAt + LOADER_MIN_MS;
  const latestRelease = startedAt + LOADER_MAX_MS;

  if (readyAt === null) return latestRelease;

  return Math.min(Math.max(readyAt, earliestRelease), latestRelease);
}
