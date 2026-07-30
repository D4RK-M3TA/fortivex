import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'FortiVex built our BI web app for the chrome washing plant—we now have real-time visibility into production, throughput, and quality. Exactly what we needed.',
    author: 'Tefo Mokoena',
    role: 'COO at Menelinks Mining Pty Ltd',
    rating: 4,
  },
  {
    quote: 'FortiVex built our ticketing and payment system—we used to do everything manually. Now we sell tickets and take payments online. Game changer.',
    author: 'Abednego Masike',
    role: 'Manager',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;
    if (!section || !header || !cards) return;
    if (prefersReducedMotion()) {
      gsap.set(
        [header, ...cards.querySelectorAll('.testimonial-card'), ...cards.querySelectorAll('.quote-text')],
        { clearProps: 'all' }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(header,
        { x: '-5vw', opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 55%',
            scrub: 0.25,
          }
        }
      );

      // Cards animation
      const cardElements = cards.querySelectorAll('.testimonial-card');
      cardElements.forEach((card, index) => {
        const direction = index === 0 ? '-8vw' : '8vw';
        gsap.fromTo(card,
          { x: direction, opacity: 0, rotateY: index === 0 ? 5 : -5 },
          {
            x: 0, opacity: 1, rotateY: 0,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 0.3,
            }
          }
        );

        // Quote text animation
        const quoteText = card.querySelector('.quote-text');
        if (quoteText) {
          gsap.fromTo(quoteText,
            { y: 20, opacity: 0 },
            {
              y: 0, opacity: 1,
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 0.25,
              }
            }
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="testimonials"
      ref={sectionRef}
      className="section-flowing bg-white relative"
      style={{ zIndex: 80 }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-fortivex-red/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20 relative">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <span className="glass-pill mb-4 inline-block">Testimonials</span>
          <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-semibold text-fortivex-text-primary">
            What clients say
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="testimonial-card glass-card p-8 lg:p-10 relative"
              style={{ 
                minHeight: '50vh',
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Quote icon */}
              <div className="mb-6 flex items-center justify-between">
                <Quote size={40} className="text-fortivex-red opacity-40" strokeWidth={1} />
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-fortivex-red fill-fortivex-red" />
                  ))}
                </div>
              </div>

              {/* Quote text */}
              <blockquote className="quote-text font-heading text-xl lg:text-2xl text-fortivex-text-primary leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="mt-auto">
                <p className="font-medium text-fortivex-text-primary">
                  {testimonial.author}
                </p>
                <p className="text-sm text-fortivex-text-secondary">
                  {testimonial.role}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-fortivex-red/10 to-transparent rounded-bl-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
