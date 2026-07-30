import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'sonner';
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import CaseStudiesSection from './sections/CaseStudiesSection';
import TechStackSection from './sections/TechStackSection';
import ProcessSection from './sections/ProcessSection';
import AutomationSection from './sections/AutomationSection';
// import TeamSection from './sections/TeamSection'; // Commented out — re-enable when using Meet the builders
import TestimonialsSection from './sections/TestimonialsSection';
import CTASection from './sections/CTASection';
import ContactSection from './sections/ContactSection';
import ThreeBackground from './components/ThreeBackground';
import SectionNavigator from './components/SectionNavigator';
import { scrollToSection } from './lib/scroll';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  // Show Three.js background immediately so 3D renders on first paint (no artificial delay)
  const [showThreeBg] = useState(true);

  // Start at top on load/refresh unless the URL deep-links to a section
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    // Wait for all sections to mount and create their ScrollTriggers
    const timer = setTimeout(() => {
      // Land on the deep-linked section if the URL has one, otherwise top
      // (avoids inconsistent restore once snap is applied)
      const hash = window.location.hash.slice(1);
      if (hash) {
        scrollToSection(hash);
      } else {
        window.scrollTo(0, 0);
      }

      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;
            
            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.4 },
          delay: 0,
          ease: "power2.out"
        }
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-white min-h-screen">
      {/* Three.js Background — mounts immediately for fast 3D */}
      {showThreeBg && <ThreeBackground />}
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      {/* Toast notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(15, 22, 46, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(167, 177, 216, 0.2)',
            color: '#F2F5FF',
          },
        }}
      />
      
      {/* Navigation */}
      <Navbar />

      {/* Section prev/next arrows */}
      <SectionNavigator />

      {/* Back to top — fixed on right, doesn't affect section layout */}
      <button
        type="button"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }}
        aria-label="Back to top"
        className="fixed right-4 bottom-8 z-[110] hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full border border-fortivex-border-strong text-fortivex-text-primary hover:bg-fortivex-surface-glass hover:border-fortivex-red/50 hover:text-fortivex-red transition-colors duration-200 text-sm font-medium bg-white/95 backdrop-blur-sm"
      >
        <ArrowUp size={18} />
        Back to top
      </button>
      
      {/* Main content */}
      <main className="relative">
        {/* Section 1: Hero - pin: true */}
        <HeroSection />
        
        {/* Section 2: Services - pin: false */}
        <ServicesSection />
        
        {/* Section 3: Case Studies - pin: true */}
        <CaseStudiesSection />
        
        {/* Section 4: Tech Stack - pin: false */}
        <TechStackSection />
        
        {/* Section 5: Process - pin: true */}
        <ProcessSection />
        
        {/* Section 6: Automation - pin: false */}
        <AutomationSection />
        
        {/* Section 7: Meet the builders — commented out for later use */}
        {/* <TeamSection /> */}

        {/* Section 8: Testimonials - pin: false */}
        <TestimonialsSection />
        
        {/* Section 9: CTA - pin: true */}
        <CTASection />
        
        {/* Section 10: Contact - pin: false */}
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
