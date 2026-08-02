import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Quote, Star } from 'lucide-react';
import { prefersReducedMotion, revealOnScroll } from '@/lib/motion';

const testimonials = [
  {
    quote: 'FortiVex built our BI web app for the chrome washing plant. We now have real-time visibility into production, throughput, and quality. Exactly what we needed.',
    author: 'Tefo Mokoena',
    role: 'COO at Menelinks Mining Pty Ltd',
    rating: 4,
  },
  {
    quote: 'FortiVex built our ticketing and payment system. We used to do everything manually. Now we sell tickets and take payments online. Game changer.',
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
      gsap.set([header, ...cards.querySelectorAll('.testimonial-card')], { clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      revealOnScroll(header, { x: -16 });
      cards.querySelectorAll('.testimonial-card').forEach((card, i) => {
        revealOnScroll(card, { y: 20, delay: i * 0.08 });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-flowing bg-fortivex-raised relative"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] max-w-[100vw] bg-fortivex-red/5 rounded-full blur-[100px]" />
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
              className="testimonial-card glass-card p-8 lg:p-10 relative flex flex-col"
              style={{ minHeight: '50vh' }}
            >
              {/* Quote icon */}
              <div className="mb-6 flex items-center justify-between">
                <Quote size={40} className="text-fortivex-red opacity-40" strokeWidth={1} aria-hidden />
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-fortivex-red fill-fortivex-red" />
                  ))}
                </div>
              </div>

              {/* Quote text */}
              <blockquote className="font-heading text-xl lg:text-2xl text-fortivex-text-primary leading-relaxed mb-8">
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-fortivex-red/10 to-transparent rounded-bl-full pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
