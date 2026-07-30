import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Python', color: '#3776AB' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Kubernetes', color: '#326CE5' },
  { name: 'CI/CD', color: '#4F6DFF' },
];

export default function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    if (prefersReducedMotion()) {
      gsap.set([content, ...content.querySelectorAll('.tech-chip')], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(content,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            end: 'top 50%',
            scrub: 0.25,
          }
        }
      );

      const chipElements = content.querySelectorAll('.tech-chip');
      chipElements.forEach((chip, index) => {
        const direction = index % 2 === 0 ? -12 : 12;
        gsap.fromTo(chip,
          { x: direction, opacity: 0 },
          {
            x: 0, opacity: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              end: 'top 45%',
              scrub: 0.2,
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="tech-stack"
      ref={sectionRef}
      className="section-flowing bg-white relative"
      style={{ zIndex: 40 }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-fortivex-red/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20 relative">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="glass-pill mb-4 inline-block">Our Stack</span>
            <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-semibold text-fortivex-text-primary mb-4">
              Tech Stack
            </h2>
            <p className="text-lg text-fortivex-text-secondary max-w-xl mx-auto">
              Modern, proven, and maintainable—so your team can move fast without breaking things.
            </p>
          </div>

          {/* Tech Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="tech-chip glass-card px-5 py-3 flex items-center gap-3 hover:-translate-y-1 hover:border-fortivex-red/50 transition-[transform,border-color] duration-300 cursor-default group"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: tech.color, boxShadow: `0 0 10px ${tech.color}` }}
                />
                <span className="font-medium text-fortivex-text-primary group-hover:text-fortivex-red transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
