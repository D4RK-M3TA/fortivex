import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, BarChart3, Ticket } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

// Aligned with testimonials: Menelinks Mining BI app, and ticketing & payments
const caseStudies = [
  {
    label: 'MINING & INDUSTRY',
    title: 'BI web app for chrome washing plant',
    description: 'Real-time visibility into production, throughput, and quality. Built for Menelinks Mining Pty Ltd.',
    stats: { metric: 'Real-time', label: 'Production visibility' },
    icon: BarChart3,
  },
  {
    label: 'TICKETING & PAYMENTS',
    title: 'Online ticketing and payment system',
    description: 'From manual processes to selling tickets and taking payments online. A complete game changer.',
    stats: { metric: 'Online', label: 'Payments & tickets' },
    icon: Ticket,
  },
];

export default function CaseStudiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;
    const glow = glowRef.current;
    if (!section || !leftCard || !rightCard) return;
    if (prefersReducedMotion()) {
      gsap.set([leftCard, rightCard, glow], { clearProps: 'all' });
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
        .fromTo(leftCard, 
          { x: '-60vw', opacity: 0, rotateY: 15 }, 
          { x: 0, opacity: 1, rotateY: 0, ease: 'none' }, 
          0
        )
        .fromTo(rightCard, 
          { x: '60vw', opacity: 0, rotateY: -15 }, 
          { x: 0, opacity: 1, rotateY: 0, ease: 'none' }, 
          0
        )
        .fromTo(glow,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, ease: 'none' },
          0
        );

      // SETTLE (30%-70%): Hold position

      // EXIT (70%-100%)
      scrollTl
        .fromTo(leftCard, 
          { x: 0, opacity: 1 }, 
          { x: '-20vw', opacity: 0, ease: 'power2.in' }, 
          0.70
        )
        .fromTo(rightCard, 
          { x: 0, opacity: 1 }, 
          { x: '20vw', opacity: 0, ease: 'power2.in' }, 
          0.70
        )
        .fromTo(glow,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.70
        );

      // Ambient glow pulse during settle
      gsap.to(glow, {
        scale: 1.1,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="work"
      className="section-pinned bg-white flex items-center justify-center overflow-hidden"
      style={{ zIndex: 30 }}
    >
      {/* Background glow */}
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(229, 57, 53, 0.1), transparent 50%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="w-full h-full flex flex-col py-6 lg:py-8 px-6 lg:px-12 xl:px-20 relative">
        {/* Section header — fixed height so grid gets remaining space */}
        <div className="text-center mb-6 lg:mb-8 flex-shrink-0">
          <span className="glass-pill mb-4 inline-block">Featured Work</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-fortivex-text-primary">
            Projects that deliver
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1 min-h-0 content-start">
          {caseStudies.map((project, index) => {
            const Icon = project.icon;
            const cardRef = index === 0 ? leftCardRef : rightCardRef;
            return (
              <div
                key={project.title}
                ref={cardRef}
                className="glass-card group cursor-pointer p-6 lg:p-8 flex flex-col min-h-0 border border-fortivex-border-subtle hover:border-fortivex-red/30 hover:shadow-lg hover:shadow-fortivex-red/5 transition-[border-color,box-shadow] duration-300 rounded-2xl"
                style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="glass-pill text-xs font-medium text-fortivex-text-secondary">
                    {project.label}
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-fortivex-red/10 border border-fortivex-red/20">
                    <Icon size={14} className="text-fortivex-red shrink-0" />
                    <span className="text-xs font-medium text-fortivex-red">{project.stats.metric}</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-heading text-xl lg:text-2xl font-semibold text-fortivex-text-primary mb-3 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-fortivex-text-secondary text-sm lg:text-base leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 text-fortivex-red text-sm font-medium group-hover:gap-3 transition-[gap]">
                    <span>View case study</span>
                    <ArrowUpRight size={16} className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
