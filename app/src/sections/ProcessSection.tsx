import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Search, Code, Rocket, Headphones, ChevronRight, Layers } from 'lucide-react';
import { prefersReducedMotion, revealOnScroll } from '@/lib/motion';
import { PatternPanel } from '@/components/ui/pattern-panel';

const processSteps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Goals, constraints, and success metrics. We learn your business before writing a line of code.',
    number: '01',
  },
  {
    icon: Code,
    title: 'Build',
    description: 'Iterative delivery with weekly demos, so you see progress and can steer early.',
    number: '02',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Release, monitor, and stabilize in production.',
    number: '03',
  },
  {
    icon: Headphones,
    title: 'Support & Retainer',
    description: "We stay on as a partner, with monitoring, fixes, and continuous improvement instead of a one-off handoff.",
    number: '04',
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const processCardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const textBlock = textBlockRef.current;
    const processCard = processCardRef.current;
    if (!section || !textBlock || !processCard) return;
    if (prefersReducedMotion()) {
      gsap.set([textBlock, processCard, ...processCard.querySelectorAll('.process-step')], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      revealOnScroll(textBlock, { x: -20 });
      revealOnScroll(processCard, { x: 20 });
      processCard.querySelectorAll('.process-step').forEach((step, i) => {
        revealOnScroll(step, { y: 16, delay: 0.1 + i * 0.06, start: 'top 90%' });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-flowing bg-fortivex-raised relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] max-w-[100vw] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(229, 57, 53, 0.08), transparent 50%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="w-full px-6 lg:px-12 xl:px-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Block */}
          <div ref={textBlockRef} className="relative z-10">
            <span className="glass-pill mb-4 inline-block">How We Work</span>
            <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-semibold text-fortivex-text-primary mb-6">
              Our Process
            </h2>
            <p className="text-lg text-fortivex-text-secondary leading-relaxed max-w-md mb-8">
              A transparent process designed to reduce risk and keep momentum high, with a relationship that continues after launch.
            </p>

            <div className="hidden lg:block aspect-video rounded-2xl overflow-hidden">
              <PatternPanel icon={Layers} className="w-full h-full" />
            </div>
          </div>

          {/* Process Card */}
          <div ref={processCardRef} className="glass-card p-6 lg:p-8">
            <div className="space-y-4">
              {processSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="process-step group p-5 rounded-2xl bg-white/[0.03] border border-fortivex-border-subtle hover:border-fortivex-red/50 transition-colors duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon size={22} className="text-fortivex-red" strokeWidth={1.5} />
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
