import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Bot, KeyRound, Users } from 'lucide-react';
import { prefersReducedMotion, revealOnScroll } from '@/lib/motion';

const differentiators = [
  {
    icon: Bot,
    title: 'We ship the agent first',
    description: "Most builds start with the website. We start with the thing that actually runs your business.",
  },
  {
    icon: KeyRound,
    title: 'You own what we build',
    description: 'Source code, data, and integrations stay yours. No walled garden.',
  },
  {
    icon: Users,
    title: 'One team, start to finish',
    description: 'Strategy, build, and support come from the same people, not a handoff between departments.',
  },
];

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const list = listRef.current;
    if (!section || !content || !list) return;
    if (prefersReducedMotion()) {
      gsap.set([content, list], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      revealOnScroll(content, { x: -20 });
      list.querySelectorAll('.diff-item').forEach((item, i) => {
        revealOnScroll(item, { x: 20, delay: 0.1 + i * 0.08 });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="why" className="section-flowing bg-fortivex-black relative" ref={sectionRef}>
      <div className="w-full px-6 lg:px-12 xl:px-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={contentRef}>
            <span className="glass-pill mb-4 inline-block">Why Fortivex</span>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-fortivex-text-primary mb-6">
              A specialist studio, not a generalist agency
            </h2>
            <p className="text-lg text-fortivex-text-secondary leading-relaxed max-w-md">
              Most agencies bolt a chatbot widget onto a template site and call it "AI-enabled." We build the agents
              and automations first, then the software to run them on, so what you get works the way your business
              actually runs, and we stay on to keep it running.
            </p>
          </div>

          <div ref={listRef} className="flex flex-col gap-4">
            {differentiators.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="diff-item glass-card p-5 flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-fortivex-red/10 flex items-center justify-center">
                    <Icon size={20} className="text-fortivex-red" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-medium text-fortivex-text-primary mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-fortivex-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
