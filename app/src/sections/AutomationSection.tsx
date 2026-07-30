import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Link2, ArrowRight } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';
import { PatternPanel } from '@/components/ui/pattern-panel';

gsap.registerPlugin(ScrollTrigger);

const automationCards = [
  {
    title: 'Workflow automation',
    description: 'Connect tools, eliminate repetitive tasks, and enforce consistency across teams. Build workflows that scale.',
    icon: Zap,
    features: ['No-code builders', 'API integrations', 'Scheduled tasks'],
  },
  {
    title: 'Integrations that last',
    description: 'We build APIs and connectors that are documented, tested, and easy to extend. Future-proof your stack.',
    icon: Link2,
    features: ['REST & GraphQL', 'Webhook handling', 'Error recovery'],
  },
];

export default function AutomationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;
    const header = headerRef.current;
    if (!section || !leftCard || !rightCard || !header) return;
    if (prefersReducedMotion()) {
      gsap.set([header, leftCard, rightCard, ...section.querySelectorAll('.text-panel')], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(header,
        { y: -30, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 55%',
            scrub: 0.25,
          }
        }
      );

      // Left card animation
      gsap.fromTo(leftCard,
        { x: '-10vw', opacity: 0, rotateY: 8 },
        {
          x: 0, opacity: 1, rotateY: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 45%',
            scrub: 0.3,
          }
        }
      );

      // Right card animation
      gsap.fromTo(rightCard,
        { x: '10vw', opacity: 0, rotateY: -8 },
        {
          x: 0, opacity: 1, rotateY: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 40%',
            scrub: 0.3,
          }
        }
      );

      // Text panels animation
      const textPanels = section.querySelectorAll('.text-panel');
      textPanels.forEach((panel) => {
        gsap.fromTo(panel,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1,
            scrollTrigger: {
              trigger: panel,
              start: 'top 90%',
              end: 'top 65%',
              scrub: 0.25,
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="automation"
      ref={sectionRef}
      className="section-flowing bg-white relative"
      style={{ zIndex: 60 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fortivex-red/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20 relative">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <span className="glass-pill mb-4 inline-block">Automation</span>
          <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-semibold text-fortivex-text-primary mb-4">
            Work smarter, not harder
          </h2>
          <p className="text-lg text-fortivex-text-secondary max-w-2xl mx-auto">
            Automate repetitive tasks and connect your tools. Free your team to focus on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Card */}
          <div 
            ref={leftCardRef}
            className="glass-card overflow-hidden group"
            style={{ 
              height: '70vh',
              perspective: '1200px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="relative h-full">
              <PatternPanel
                icon={automationCards[0].icon}
                className="w-full h-full transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
              
              {/* Text Panel */}
              <div className="text-panel absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="glass-card-strong p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-fortivex-red/20 flex items-center justify-center">
                      <Zap size={20} className="text-fortivex-red" />
                    </div>
                    <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-fortivex-text-primary">
                      {automationCards[0].title}
                    </h3>
                  </div>
                  <p className="text-fortivex-text-secondary mb-4">
                    {automationCards[0].description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {automationCards[0].features.map((feature) => (
                      <span key={feature} className="glass-pill text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 text-fortivex-red text-sm group/btn">
                    <span>Explore automation</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div 
            ref={rightCardRef}
            className="glass-card overflow-hidden group"
            style={{ 
              height: '70vh',
              perspective: '1200px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="relative h-full">
              <PatternPanel
                icon={automationCards[1].icon}
                className="w-full h-full transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
              
              {/* Text Panel */}
              <div className="text-panel absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="glass-card-strong p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-fortivex-red/20 flex items-center justify-center">
                      <Link2 size={20} className="text-fortivex-red" />
                    </div>
                    <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-fortivex-text-primary">
                      {automationCards[1].title}
                    </h3>
                  </div>
                  <p className="text-fortivex-text-secondary mb-4">
                    {automationCards[1].description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {automationCards[1].features.map((feature) => (
                      <span key={feature} className="glass-pill text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 text-fortivex-red text-sm group/btn">
                    <span>View integrations</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
