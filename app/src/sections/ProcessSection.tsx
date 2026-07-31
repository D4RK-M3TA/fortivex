import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, PenTool, Code, Rocket, ChevronRight, Layers } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';
import { PatternPanel } from '@/components/ui/pattern-panel';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'Goals, constraints, and success metrics. We understand your business deeply.',
    number: '01',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'Architecture, UX, and a clear delivery plan. Blueprint for success.',
    number: '02',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: Code,
    title: 'Build',
    description: 'Iterative delivery with weekly demos. See progress in real-time.',
    number: '03',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Release, monitor, and optimize. Continuous improvement post-launch.',
    number: '04',
    color: 'from-orange-500/20 to-amber-500/20',
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const processCardRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const textBlock = textBlockRef.current;
    const processCard = processCardRef.current;
    const outline = outlineRef.current;
    if (!section || !textBlock || !processCard) return;
    if (prefersReducedMotion()) {
      gsap.set([textBlock, processCard, outline, ...processCard.querySelectorAll('.process-step')], { clearProps: 'all' });
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
          { x: '-12vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0
        )
        .fromTo(processCard, 
          { x: '60vw', opacity: 0, rotateY: -12 }, 
          { x: 0, opacity: 1, rotateY: 0, ease: 'none' }, 
          0
        )
        .fromTo(outline,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 0.08, ease: 'none' },
          0
        );

      // Steps stagger
      const steps = processCard.querySelectorAll('.process-step');
      steps.forEach((step, index) => {
        scrollTl.fromTo(step,
          { y: 50, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, ease: 'none' },
          0.05 + index * 0.05
        );
      });

      // SETTLE (30%-70%): Hold position

      // EXIT (70%-100%)
      scrollTl
        .fromTo(textBlock, 
          { x: 0, opacity: 1 }, 
          { x: '-15vw', opacity: 0, ease: 'power2.in' }, 
          0.70
        )
        .fromTo(processCard, 
          { x: 0, opacity: 1 }, 
          { x: '15vw', opacity: 0, ease: 'power2.in' }, 
          0.70
        )
        .fromTo(outline,
          { opacity: 0.08 },
          { opacity: 0, ease: 'power2.in' },
          0.70
        );

      // Grid drift animation
      gsap.to(gridRef.current, {
        x: -20,
        duration: 8,
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
      id="process"
      className="section-pinned bg-white flex items-center justify-center overflow-hidden"
      style={{ zIndex: 50 }}
    >
      {/* Diagonal grid lines */}
      <svg 
        ref={gridRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
        style={{ mixBlendMode: 'overlay' }}
      >
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 80" fill="none" stroke="rgba(229, 57, 53, 0.3)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Background outline word */}
      <div 
        ref={outlineRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ opacity: 0 }}
      >
        <span 
          className="font-heading text-[25vw] font-bold tracking-tighter"
          style={{ 
            WebkitTextStroke: '1px rgba(229, 57, 53, 0.15)',
            WebkitTextFillColor: 'transparent',
          }}
        >
          PROCESS
        </span>
      </div>

      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] max-w-[100vw] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(229, 57, 53, 0.08), transparent 50%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="w-full h-full flex flex-col justify-center py-6 lg:py-8 px-6 lg:px-12 xl:px-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Block */}
          <div ref={textBlockRef} className="relative z-10">
            <span className="glass-pill mb-4 inline-block">How We Work</span>
            <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-semibold text-fortivex-text-primary mb-6">
              Our Process
            </h2>
            <p className="text-lg text-fortivex-text-secondary leading-relaxed max-w-md mb-8">
              A transparent process designed to reduce risk and keep momentum high. From discovery to launch, we're with you every step.
            </p>
            
            {/* Process visual */}
            <div className="hidden lg:block aspect-video rounded-2xl overflow-hidden">
              <PatternPanel icon={Layers} className="w-full h-full" />
            </div>
          </div>

          {/* Process Card */}
          <div 
            ref={processCardRef}
            className="glass-card p-6 lg:p-8"
            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
          >
            <div className="space-y-4">
              {processSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={step.title}
                    className={`process-step group p-5 rounded-2xl bg-gradient-to-r ${step.color} border border-fortivex-border-subtle hover:border-fortivex-red/50 transition-colors duration-300 cursor-pointer`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-fortivex-surface-glass flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon 
                          size={22} 
                          className="text-fortivex-red"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-medium text-fortivex-text-secondary/60">
                            {step.number}
                          </span>
                          <h3 className="font-heading text-lg font-medium text-fortivex-text-primary group-hover:text-fortivex-red transition-colors">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-sm text-fortivex-text-secondary">
                          {step.description}
                        </p>
                      </div>
                      <ChevronRight 
                        size={18} 
                        className="text-fortivex-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-[opacity,transform] flex-shrink-0 mt-1"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
