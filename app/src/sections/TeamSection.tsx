import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';

const WHATSAPP_URL = 'https://wa.me/27683572983'; // +27 68 357 2983

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'Lead Engineer',
    image: '/team_alex.jpg',
    bio: '10+ years building scalable systems',
  },
  {
    name: 'Maya Patel',
    role: 'Product Designer',
    image: '/team_maya.jpg',
    bio: 'Crafting intuitive user experiences',
  },
  {
    name: 'Jordan Reyes',
    role: 'Automation Architect',
    image: '/team_jordan.jpg',
    bio: 'Connecting systems that scale',
  },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;
    if (!section || !header || !cards) return;
    if (prefersReducedMotion()) {
      gsap.set([header, ...cards.querySelectorAll('.team-card')], { clearProps: 'all' });
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
            start: 'top 75%',
            end: 'top 55%',
            scrub: 0.25,
          }
        }
      );

      // Cards animation
      const cardElements = cards.querySelectorAll('.team-card');
      cardElements.forEach((card, index) => {
        gsap.fromTo(card,
          { y: '12vh', opacity: 0, scale: 0.9, rotateY: index === 0 ? -5 : index === 2 ? 5 : 0 },
          {
            y: 0, opacity: 1, scale: 1, rotateY: 0,
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
      id="team"
      className="section-flowing bg-white relative"
      style={{ zIndex: 70 }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-fortivex-red/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20 relative">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span className="glass-pill mb-4 inline-block">The Team</span>
          <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-semibold text-fortivex-text-primary mb-4">
            Meet the builders
          </h2>
          <p className="text-lg text-fortivex-text-secondary max-w-2xl mx-auto">
            Engineers, designers, and product thinkers who care about craft.
          </p>
        </div>

        {/* Team Cards */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="team-card glass-card overflow-hidden group cursor-pointer hover:-translate-y-2 hover:border-fortivex-red/50 transition-[transform,border-color] duration-500"
              style={{ 
                height: '58vh',
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="relative h-full">
                <img 
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm text-fortivex-red mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {member.bio}
                  </p>
                  <h3 className="font-heading text-xl lg:text-2xl font-semibold text-fortivex-text-primary mb-1">
                    {member.name}
                  </h3>
                  <p className="text-fortivex-text-secondary mb-4">
                    {member.role}
                  </p>
                  
                  {/* WhatsApp */}
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat on WhatsApp"
                      className="w-10 h-10 rounded-full bg-fortivex-surface-glass border border-fortivex-border-subtle flex items-center justify-center hover:border-fortivex-red hover:bg-fortivex-red/10 transition-colors"
                    >
                      <MessageCircle size={18} className="text-fortivex-text-secondary" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
