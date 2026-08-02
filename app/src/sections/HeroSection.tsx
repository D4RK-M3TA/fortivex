import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Calendar } from 'lucide-react';
import ShaderBackground from '@/components/ShaderBackground';
import HeroDemoWidget from '@/components/HeroDemoWidget';
import { handleSectionLinkClick } from '@/lib/scroll';
import { prefersReducedMotion } from '@/lib/motion';

// Headline options considered — first is live, others kept for easy swapping:
// 1. "AI agents and automation that run your business while you sleep."
// 2. "Automate the busywork. Ship the business."
// 3. "Bots and agents that work while you don't."
const HEADLINE = 'AI agents and automation that run your business while you sleep.';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Load animation (auto-play on mount) — a single orchestrated entrance,
  // not tied to scroll position.
  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(
        [eyebrowRef.current, headlineRef.current, subheadlineRef.current, ctaRef.current, visualRef.current],
        { clearProps: 'all' }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      gsap.to(glowRef.current, {
        scale: 1.1,
        opacity: 0.3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      tl.fromTo(eyebrowRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 }
      )
        .fromTo(headlineRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.25'
        )
        .fromTo(subheadlineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          '-=0.3'
        )
        .fromTo(ctaRef.current,
          { y: 20, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.35 },
          '-=0.25'
        )
        .fromTo(visualRef.current,
          { y: 30, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.5'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-fortivex-black"
    >
      {/* Living shader background */}
      <ShaderBackground className="opacity-90" />

      {/* Subtle overlay so content stays readable */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,11,0.4) 0%, transparent 40%, transparent 70%, rgba(10,10,11,0.5) 100%)',
        }}
      />

      {/* Animated glow */}
      <div
        ref={glowRef}
        className="absolute top-[20%] right-[25%] w-[600px] h-[600px] max-w-[100vw] pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(circle, rgba(229, 57, 53, 0.18), transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="w-full flex items-center pt-24 pb-16 lg:pt-28 px-6 lg:px-12 xl:px-20 relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Column */}
          <div className="relative z-10 max-w-xl">
            <span
              ref={eyebrowRef}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest border border-white/20 bg-white/10 text-white/90 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-fortivex-red shrink-0" aria-hidden />
              AI Agents &amp; Automation Studio
            </span>

            <h1
              ref={headlineRef}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white mb-6 text-balance"
            >
              {HEADLINE}
            </h1>

            <p
              ref={subheadlineRef}
              className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-md"
            >
              AI agents &amp; WhatsApp bots, business automation, and the websites &amp; software to run it all on.
            </p>

            <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                onClick={(e) => handleSectionLinkClick(e, '#contact')}
                className="btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Calendar size={18} />
                  Book a call
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-fortivex-red to-red-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#work"
                onClick={(e) => handleSectionLinkClick(e, '#work')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-colors duration-300 bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/50 group"
              >
                See our work
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-[opacity,transform]" />
              </a>
            </div>
          </div>

          {/* Hero demo widget (chat / background agent toggle) + stats */}
          <div ref={visualRef} className="relative">
            <HeroDemoWidget />

            <div className="mt-6 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 px-5 py-4 flex items-center justify-between max-w-sm mx-auto">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Projects Delivered</p>
                <p className="text-2xl font-heading font-semibold text-white">30+</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Client Satisfaction</p>
                <p className="text-2xl font-heading font-semibold text-fortivex-red">98%</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Years Experience</p>
                <p className="text-2xl font-heading font-semibold text-white">4+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
