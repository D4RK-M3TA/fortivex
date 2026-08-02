import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared check for prefers-reduced-motion. Sections use this to skip
 * scroll-triggered animations entirely for motion-sensitive users,
 * rather than just slowing the animations down.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * One-shot fade + slight slide-in when an element scrolls into view.
 * Replaces the site's old pin/scrub scroll-jacking with a single calm
 * pattern: plays once, doesn't pin the section, doesn't tie progress to
 * scroll position. Callers still guard with prefersReducedMotion() first.
 */
export function revealOnScroll(
  targets: gsap.DOMTarget,
  opts: { y?: number; x?: number; delay?: number; start?: string } = {}
): gsap.core.Tween {
  const { y = 24, x = 0, delay = 0, start = 'top 85%' } = opts;
  return gsap.fromTo(
    targets,
    { y, x, opacity: 0 },
    {
      y: 0,
      x: 0,
      opacity: 1,
      duration: 0.6,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: targets,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );
}

gsap.registerPlugin(ScrollTrigger);
