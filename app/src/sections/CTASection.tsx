import { useRef, useLayoutEffect, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import { handleSectionLinkClick } from '@/lib/scroll';
import { CTAShaderBackground } from '@/components/CTAShaderBackground';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { prefersReducedMotion, revealOnScroll } from '@/lib/motion';

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const textBlock = textBlockRef.current;
    if (!section || !textBlock) return;
    if (prefersReducedMotion()) {
      gsap.set(textBlock, { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      revealOnScroll(textBlock, { y: 20 });
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
      className="section-flowing bg-fortivex-black flex items-center justify-center overflow-hidden relative"
    >
      {/* WebGL shader background — FortiVex red wave */}
      <CTAShaderBackground />

      {/* Soft glow */}
      <div
        className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[600px] h-[600px] max-w-[100vw] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(229, 57, 53, 0.12), transparent 50%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="w-full flex flex-col items-center justify-center px-6 lg:px-12 xl:px-20 relative z-10">
        <div className="w-full max-w-3xl mx-auto border border-white/10 p-2 rounded-2xl">
          <div className="relative border border-white/10 rounded-xl py-10 px-6 overflow-hidden">
            <div ref={textBlockRef} className="text-center">
              <span className="glass-pill mb-4 inline-flex items-center gap-2 text-white border-white/20 bg-white/10">
                <Sparkles size={14} className="text-fortivex-red" />
                Let's Build Together
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter text-white mb-3">
                Let's build your bot, agent, or website
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
                <LiquidButton asChild size="xl" className="group">
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
          </div>
        </div>
      </div>
    </section>
  );
}
