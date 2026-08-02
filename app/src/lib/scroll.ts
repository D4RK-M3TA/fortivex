import type { MouseEvent } from 'react';

/**
 * Scroll to a section by id in one shot (no stepping through intermediate sections).
 * Accepts "contact" or "#contact". Uses instant scroll so GSAP snap doesn't force multiple stops.
 * Deliberately does not touch the URL — changing it on every click reads as page
 * navigation rather than in-page scrolling. Direct links to a section (e.g. a
 * shared "#services" URL) are still honored on initial load in App.tsx.
 */
export function scrollToSection(idOrHash: string): void {
  const id = idOrHash.startsWith('#') ? idOrHash.slice(1) : idOrHash;
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: 'auto' });
}

/**
 * Click handler for in-page nav anchors. Lets modifier/middle clicks fall through to
 * native <a> behavior (open in new tab, etc.) instead of always hijacking navigation.
 */
export function handleSectionLinkClick(e: MouseEvent<HTMLAnchorElement>, href: string): void {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  scrollToSection(href);
}
