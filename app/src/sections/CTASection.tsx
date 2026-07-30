import { useRef, useLayoutEffect, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import { handleSectionLinkClick } from '@/lib/scroll';
import { CTAShaderBackground } from '@/components/CTAShaderBackground';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const textBlock = textBlockRef.current;
    const ctaButton = ctaButtonRef.current;
    const glow = glowRef.current;
    if (!section || !textBlock || !ctaButton) return;
    if (prefersReducedMotion()) {
      gsap.set([textBlock, ctaButton, glow], { clearProps: 'all' });
      return; // no forced pin/scroll-jack for reduced motion
    }

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.2,
        }
      });

      // ENTRANCE (0%-30%)
      scrollTl
        .fromTo(textBlock,
          { x: '-20vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(ctaButton,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.5)' },
          0.15
        )
        .fromTo(glow,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, ease: 'none' },
          0
        );

      // EXIT (70%-100%)
      scrollTl
        .fromTo(textBlock,
          { y: 0, opacity: 1 },
          { y: '-12vh', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(ctaButton,
          { scale: 1, opacity: 1 },
          { scale: 0.8, opacity: 0, ease: 'power2.in' },
          0.75
        )
        .fromTo(glow,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.70
        );

      gsap.to(glow, {
        scale: 1.15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToContact = (e: MouseEvent<HTMLAnchorElement>) => {
    handleSectionLinkClick(e, '#contact');
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="section-pinned bg-fortivex-black flex items-center justify-center overflow-hidden relative"
      style={{ zIndex: 90 }}
    >
      {/* WebGL shader background — FortiVex red wave */}
      <CTAShaderBackground />

      {/* Soft glow */}
      <div
        ref={glowRef}
        className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(229, 57, 53, 0.12), transparent 50%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="w-full flex flex-col items-center justify-center py-6 lg:py-8 px-6 lg:px-12 xl:px-20 relative z-10">
        <div className="w-full max-w-3xl mx-auto border border-white/10 p-2 rounded-2xl">
          <main className="relative border border-white/10 rounded-xl py-10 px-6 overflow-hidden">
            <div ref={textBlockRef} className="text-center">
              <span className="glass-pill mb-4 inline-flex items-center gap-2 text-white border-white/20 bg-white/10">
                <Sparkles size={14} className="text-fortivex-red" />
                Let's Build Together
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white mb-3">
                Ready to ship faster?
              </h2>
              <p className="text-white/60 text-sm sm:text-base lg:text-lg max-w-xl mx-auto mb-6">
                Tell us what you're building. We'll respond within 48 hours with a plan to make it happen.
              </p>

              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fortivex-red opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-fortivex-red" />
                </span>
                <p className="text-xs text-fortivex-red font-medium">Available for new projects</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <LiquidButton ref={ctaButtonRef} asChild size="xl" className="group">
                  <a href="#contact" onClick={scrollToContact}>
                    Start a project
                    <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </LiquidButton>
                <a
                  href="mailto:fortivex.support@gmail.com"
                  className="flex items-center gap-2 text-white/60 hover:text-fortivex-red transition-colors text-sm"
                >
                  <Mail size={18} />
                  Or email fortivex.support@gmail.com
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
