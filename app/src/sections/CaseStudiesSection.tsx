import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight, ArrowRight, BarChart3, Ticket } from 'lucide-react';
import { prefersReducedMotion, revealOnScroll } from '@/lib/motion';
import { handleSectionLinkClick } from '@/lib/scroll';
import InteractiveBotDemo from '@/components/InteractiveBotDemo';

// Both real, aligned with testimonials: Menelinks Mining BI app, ticketing &
// payments. The AI agents tier we lead with doesn't have a shipped case study
// yet, so instead of a static "illustrative" mockup, that slot is a real,
// working scripted demo visitors can click through themselves.
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
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;
    if (prefersReducedMotion()) {
      gsap.set(cards.querySelectorAll('.case-card'), { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      cards.querySelectorAll('.case-card').forEach((card, i) => {
        revealOnScroll(card, { y: 24, delay: i * 0.08 });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-flowing bg-fortivex-black relative"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] max-w-[100vw] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(229, 57, 53, 0.08), transparent 50%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="w-full px-6 lg:px-12 xl:px-20 relative">
        <div className="text-center mb-12">
          <span className="glass-pill mb-4 inline-block">Featured Work</span>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-fortivex-text-primary">
            Projects that deliver
          </h2>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {caseStudies.map((project) => {
            const Icon = project.icon;
            return (
              <div
                key={project.title}
                className="case-card glass-card group cursor-pointer p-6 lg:p-7 flex flex-col border border-fortivex-border-subtle hover:border-fortivex-red/30 hover:shadow-lg hover:shadow-fortivex-red/5 transition-[border-color,box-shadow] duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="glass-pill text-xs font-medium text-fortivex-text-secondary">
                    {project.label}
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-fortivex-red/10 border border-fortivex-red/20 shrink-0">
                    <Icon size={14} className="text-fortivex-red shrink-0" />
                    <span className="text-xs font-medium text-fortivex-red">{project.stats.metric}</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-heading text-xl font-semibold text-fortivex-text-primary mb-3 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-fortivex-text-secondary text-sm leading-relaxed mb-5 flex-1">
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

          {/* The AI agents tier's slot: a real, clickable demo instead of a static mockup */}
          <div className="case-card glass-card p-6 lg:p-7 flex flex-col border border-fortivex-border-subtle">
            <div className="flex items-start justify-between gap-3 mb-4">
              <span className="glass-pill text-xs font-medium text-fortivex-text-secondary">
                TRY IT: AI AGENTS
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-emerald-300">Live demo</span>
              </div>
            </div>
            <h3 className="font-heading text-xl font-semibold text-fortivex-text-primary mb-3 leading-tight">
              A WhatsApp agent you can talk to right now
            </h3>
            <p className="text-fortivex-text-secondary text-sm leading-relaxed mb-4">
              Not a screenshot. Tap a reply below and see how a Fortivex bot actually handles the conversation.
            </p>
            <InteractiveBotDemo className="mb-4" />
            <a
              href="#contact"
              onClick={(e) => handleSectionLinkClick(e, '#contact')}
              className="flex items-center gap-2 text-fortivex-red text-sm font-medium group/link mt-auto"
            >
              <span>Want one like this?</span>
              <ArrowRight size={16} className="shrink-0 group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
