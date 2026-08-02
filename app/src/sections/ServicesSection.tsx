import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import {
  Bot,
  Workflow,
  Globe,
  Headphones,
  Search,
  ArrowRight,
  Check,
} from 'lucide-react';
import { prefersReducedMotion, revealOnScroll } from '@/lib/motion';
import { handleSectionLinkClick } from '@/lib/scroll';
import { PatternPanel } from '@/components/ui/pattern-panel';

const tiers = [
  {
    icon: Bot,
    title: 'AI Agents & WhatsApp Bots',
    description: 'Automated conversations that qualify leads, take orders, and support customers, live on WhatsApp and web, 24/7.',
    bullets: [
      'Lead qualification & booking flows',
      'Order & support conversations',
      'Handoff to a human when it matters',
      'Live on WhatsApp, web, or both',
    ],
  },
  {
    icon: Workflow,
    title: 'Business Automation',
    description: 'Replace manual work with reliable workflows and integrations that run without you watching them.',
    bullets: [
      'Workflow & approval automation',
      'API & tool integrations',
      'Scheduled and event-driven jobs',
      'Error recovery built in, not bolted on',
    ],
  },
  {
    icon: Globe,
    title: 'Websites & Custom Software',
    description: 'Fast, modern web applications, from startup MVPs to production systems that scale with you.',
    bullets: [
      'Marketing sites & web apps',
      'MVP builds for startups',
      'Custom internal tools',
      'API development & integrations',
    ],
  },
];

const extensions = [
  {
    icon: Headphones,
    title: 'Maintenance & Support Retainers',
    description: 'Monitoring, fixes, and continuous improvement after launch.',
    cta: 'Get a quote',
  },
  {
    icon: Search,
    title: 'AI Readiness Audit',
    description: "A clear look at where AI and automation will save your business the most time.",
    cta: 'Book an audit',
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
      revealOnScroll(title, { x: -24, start: 'top 80%' });
      cards.querySelectorAll('.service-card').forEach((card, i) => {
        revealOnScroll(card, { y: 20, delay: i * 0.08 });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-flowing bg-fortivex-black relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] max-w-[100vw] bg-fortivex-red/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] max-w-[100vw] bg-fortivex-red/5 rounded-full blur-[80px]" />
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
              Three ways we help you ship faster and run leaner, plus ongoing support once you're live.
            </p>
            <div className="hidden lg:block aspect-video rounded-2xl overflow-hidden">
              <PatternPanel icon={Bot} className="w-full h-full" />
            </div>
          </div>

          {/* Tier cards */}
          <div ref={cardsRef} className="lg:col-span-8">
            <div className="flex flex-col gap-5">
              {tiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.title}
                    className="service-card glass-card p-6 lg:p-8 group transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-fortivex-red/50 hover:shadow-glow-lg"
                  >
                    <div className="flex items-start gap-5 mb-5">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-fortivex-red/10 flex items-center justify-center group-hover:bg-fortivex-red/20 group-hover:scale-110 transition-[background-color,transform] duration-300">
                        <Icon size={26} className="text-fortivex-red" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading text-xl lg:text-2xl font-medium text-fortivex-text-primary mb-2">
                          {tier.title}
                        </h3>
                        <p className="text-fortivex-text-secondary leading-relaxed">
                          {tier.description}
                        </p>
                      </div>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6 pl-[4.75rem]">
                      {tier.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-sm text-fortivex-text-secondary">
                          <Check size={15} className="text-fortivex-red shrink-0 mt-0.5" strokeWidth={2} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pl-[4.75rem]">
                      <a
                        href="#contact"
                        onClick={(e) => handleSectionLinkClick(e, '#contact')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-fortivex-red group/link"
                      >
                        Get a quote
                        <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extension services — quieter, smaller row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {extensions.map((ext) => {
                const Icon = ext.icon;
                return (
                  <div
                    key={ext.title}
                    className="service-card glass-card p-5 flex items-start gap-4 transition-colors duration-300 hover:border-fortivex-red/40"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Icon size={18} className="text-fortivex-text-secondary" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-base font-medium text-fortivex-text-primary mb-1">
                        {ext.title}
                      </h4>
                      <p className="text-sm text-fortivex-text-secondary mb-2">
                        {ext.description}
                      </p>
                      <a
                        href="#contact"
                        onClick={(e) => handleSectionLinkClick(e, '#contact')}
                        className="text-xs font-medium text-fortivex-red hover:underline"
                      >
                        {ext.cta}
                      </a>
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
