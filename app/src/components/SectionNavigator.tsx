/**
 * Fixed prev/next arrows to jump between sections without long scrolling.
 */

import { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { scrollToSection } from '@/lib/scroll';

const SECTION_IDS = [
  'hero',
  'services',
  'why',
  'work',
  'process',
  'testimonials',
  'tech-stack',
  'cta',
  'contact',
];

export default function SectionNavigator() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const i = SECTION_IDS.indexOf(id);
          if (i >= 0) setCurrentIndex(i);
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    const prevId = SECTION_IDS[currentIndex - 1];
    setCurrentIndex(currentIndex - 1);
    scrollToSection(prevId);
  }, [currentIndex]);

  const goNext = useCallback(() => {
    if (currentIndex >= SECTION_IDS.length - 1) return;
    const nextId = SECTION_IDS[currentIndex + 1];
    setCurrentIndex(currentIndex + 1);
    scrollToSection(nextId);
  }, [currentIndex]);

  const atFirst = currentIndex <= 0;
  const atLast = currentIndex >= SECTION_IDS.length - 1;

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[110] hidden md:flex flex-col gap-1 pointer-events-auto"
      aria-label="Section navigation"
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={atFirst}
        aria-label="Previous section"
        className={`p-2.5 rounded-full border transition-colors duration-200 flex items-center justify-center ${
          atFirst
            ? 'border-fortivex-border-subtle text-gray-300 cursor-not-allowed opacity-50'
            : 'border-fortivex-border-strong text-fortivex-text-primary hover:bg-fortivex-surface-glass hover:border-fortivex-red/50 hover:text-fortivex-red'
        }`}
      >
        <ChevronUp size={22} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={goNext}
        disabled={atLast}
        aria-label="Next section"
        className={`p-2.5 rounded-full border transition-colors duration-200 flex items-center justify-center ${
          atLast
            ? 'border-fortivex-border-subtle text-gray-300 cursor-not-allowed opacity-50'
            : 'border-fortivex-border-strong text-fortivex-text-primary hover:bg-fortivex-surface-glass hover:border-fortivex-red/50 hover:text-fortivex-red'
        }`}
      >
        <ChevronDown size={22} strokeWidth={2} />
      </button>
    </div>
  );
}
