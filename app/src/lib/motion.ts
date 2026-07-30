/**
 * Shared check for prefers-reduced-motion. Sections use this to skip
 * scroll-jacked pin/scrub animations entirely for motion-sensitive users,
 * rather than just slowing the animations down.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
