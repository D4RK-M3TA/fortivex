import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe,
  Workflow,
  Plug,
  Headphones,
  MessageCircle,
  Bot,
} from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';
import { PatternPanel } from '@/components/ui/pattern-panel';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Globe,
    title: 'Web Applications',
    description: 'React/Next.js frontends that feel instant. Built for performance and scale.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Workflow,
    title: 'Business Automation',
    description: 'Replace manual work with reliable workflows that run 24/7.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp & Chatbots',
    description: 'Automated conversations that qualify leads and support customers live on WhatsApp and web, 24/7.',
    gradient: 'from-lime-500/20 to-green-500/20',
  },
  {
    icon: Plug,
    title: 'API Development',
    description: 'Clean contracts, strong security, fast performance. Built to last.',
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  {
    icon: Headphones,
    title: 'Support & Iteration',
    description: 'Monitoring, fixes, and continuous improvement post-launch.',
    gradient: 'from-rose-500/20 to-red-500/20',
  },
  {
    icon: Bot,
    title: 'Agentic AI Systems',
    description: 'Autonomous agents that plan, decide, and act across your tools, built with guardrails your team can trust.',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;
    if (!section || !title || !cards) return;
    if (prefersReducedMotion()) {
      gsap.set([title, ...cards.querySelectorAll('.service-card')], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(title,
        { opacity: 0, x: '-8vw' },
        {
          opacity: 1, x: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 45%',
            scrub: 0.25,
          }
        }
      );

      // Cards animation with 3D effect
      const cardElements = cards.querySelectorAll('.service-card');
      cardElements.forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: '12vh', rotateX: 15, scale: 0.9 },
          {
            opacity: 1, y: 0, rotateX: 0, scale: 1,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 55%',
              scrub: 0.3,
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="services"
      className="section-flowing bg-white relative"
      style={{ zIndex: 20 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-fortivex-red/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fortivex-red/5 rounded-full blur-[80px]" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Title Block - Sticky on desktop */}
          <div 
            ref={titleRef}
            className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start"
          >
            <span className="glass-pill mb-4 inline-block">What We Do</span>
            <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-semibold text-fortivex-text-primary mb-6">
              Services
            </h2>
            <p className="text-lg text-fortivex-text-secondary leading-relaxed mb-8">
              End-to-end engineering for modern teams—from first prototype to production automation.
            </p>
            <div className="hidden lg:block aspect-video rounded-2xl overflow-hidden">
              <PatternPanel icon={Workflow} className="w-full h-full" />
            </div>
          </div>

          {/* Cards Grid */}
          <div ref={cardsRef} className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className={`service-card glass-card p-6 lg:p-8 group cursor-pointer transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-2 hover:border-fortivex-red/50 hover:shadow-glow-lg relative overflow-hidden`}
                    style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                  >
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-5">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-fortivex-red/10 flex items-center justify-center group-hover:bg-fortivex-red/20 group-hover:scale-110 transition-[background-color,transform] duration-300">
                          <Icon 
                            size={26} 
                            className="text-fortivex-red group-hover:text-fortivex-red transition-colors" 
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-xl lg:text-2xl font-medium text-fortivex-text-primary mb-2 group-hover:text-fortivex-red transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-fortivex-text-secondary leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Hover indicator */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-fortivex-red opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Learn more</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
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
