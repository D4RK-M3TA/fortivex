import { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { Toaster } from 'sonner';
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import WhySection from './sections/WhySection';
import CaseStudiesSection from './sections/CaseStudiesSection';
import ProcessSection from './sections/ProcessSection';
import TestimonialsSection from './sections/TestimonialsSection';
import TechStackSection from './sections/TechStackSection';
import CTASection from './sections/CTASection';
import ContactSection from './sections/ContactSection';
import SectionNavigator from './components/SectionNavigator';
import WhatsAppFloatButton from './components/WhatsAppFloatButton';
import { scrollToSection } from './lib/scroll';

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  // Start at top on load/refresh unless the URL deep-links to a section
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    const hash = window.location.hash.slice(1);
    if (hash) {
      const timer = setTimeout(() => scrollToSection(hash), 150);
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={mainRef} className="relative bg-fortivex-black min-h-screen">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(15, 15, 17, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#F5F5F5',
          },
        }}
      />

      {/* Navigation */}
      <Navbar />

      {/* Section prev/next arrows */}
      <SectionNavigator />

      {/* WhatsApp click-to-chat — available from anywhere on the page */}
      <WhatsAppFloatButton />

      {/* Back to top — fixed on right, doesn't affect section layout */}
      <button
        type="button"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }}
        aria-label="Back to top"
        className="fixed right-4 bottom-8 z-[110] hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full border border-fortivex-border-strong text-fortivex-text-primary hover:bg-fortivex-surface-glass hover:border-fortivex-red/50 hover:text-fortivex-red transition-colors duration-200 text-sm font-medium bg-fortivex-black/80 backdrop-blur-sm"
      >
        <ArrowUp size={18} />
        Back to top
      </button>

      {/* Main content */}
      <main className="relative">
        <HeroSection />
        <ServicesSection />
        <WhySection />
        <CaseStudiesSection />
        <ProcessSection />
        <TestimonialsSection />
        <TechStackSection />
        <CTASection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
