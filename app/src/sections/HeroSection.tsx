import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar } from 'lucide-react';
import ShaderBackground from '@/components/ShaderBackground';
import { SplineScene } from '@/components/ui/spline';
import { Spotlight } from '@/components/ui/spotlight';
import { handleSectionLinkClick } from '@/lib/scroll';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const SPLINE_SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const [splineReady, setSplineReady] = useState(false);
  const orbitRef = useRef<SVGSVGElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Load animation (auto-play on mount)
  useEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(
        [eyebrowRef.current, headlineRef.current?.querySelectorAll('.word'), subheadlineRef.current, ctaRef.current, imageCardRef.current, orbitRef.current],
        { clearProps: 'all' }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Glow pulse animation
      gsap.to(glowRef.current, {
        scale: 1.1,
        opacity: 0.3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      tl.fromTo(eyebrowRef.current, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4 }
      )
      .fromTo(headlineRef.current?.querySelectorAll('.word') || [], 
        { y: 50, opacity: 0, rotateX: 45 }, 
        { y: 0, opacity: 1, rotateX: 0, duration: 0.5, stagger: 0.04 }, 
        '-=0.25'
      )
      .fromTo(subheadlineRef.current, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4 }, 
        '-=0.3'
      )
      .fromTo(ctaRef.current, 
        { y: 20, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.35 }, 
        '-=0.25'
      )
      .fromTo(imageCardRef.current, 
        { x: '25vw', opacity: 0, rotateY: 15 }, 
        { x: 0, opacity: 1, rotateY: 0, duration: 0.6, ease: 'power2.out' }, 
        '-=0.5'
      )
      .fromTo(orbitRef.current, 
        { opacity: 0, strokeDashoffset: 2000 }, 
        { opacity: 0.3, strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }, 
        '-=0.4'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven exit animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // No pin/scroll-jack for reduced motion, or below `lg`: the text block +
    // full 3D card stack in one column there and don't fit one screen — pinning
    // to a fixed 100dvh would force clipping one of them. Let it flow instead.
    if (prefersReducedMotion() || window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: 0.2,
          onLeaveBack: () => {
            gsap.set([textColumnRef.current, imageCardRef.current], { 
              opacity: 1, x: 0, scale: 1, y: 0 
            });
          }
        }
      });

      // ENTRANCE (0%-30%): Hold at fully visible
      // SETTLE (30%-70%): Static
      // EXIT (70%-100%): Elements exit
      scrollTl
        .fromTo(textColumnRef.current, 
          { x: 0, opacity: 1, y: 0 }, 
          { x: '-20vw', opacity: 0, y: '-5vh', ease: 'power2.in' }, 
          0.70
        )
        .fromTo(imageCardRef.current, 
          { x: 0, scale: 1, opacity: 1, y: 0 }, 
          { x: '15vw', scale: 0.9, opacity: 0, y: '5vh', ease: 'power2.in' }, 
          0.70
        )
        .fromTo(orbitRef.current, 
          { opacity: 0.3 }, 
          { opacity: 0 }, 
          0.70
        )
        .fromTo(glowRef.current,
          { opacity: 0.25 },
          { opacity: 0 },
          0.70
        );
    }, section);

    return () => ctx.revert();
  }, []);

  // Spline runtime is code-split and fetched eagerly (see spline.tsx) so it
  // loads in the background without blocking the rest of the page

  return (
    <section 
      id="hero"
      ref={sectionRef} 
      className="section-pinned flex items-center justify-center overflow-hidden bg-fortivex-black"
      style={{ zIndex: 10 }}
    >
      {/* Living shader background */}
      <ShaderBackground className="opacity-90" />

      {/* Subtle overlay so content stays readable */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, transparent 40%, transparent 70%, rgba(10,10,10,0.5) 100%)',
        }}
      />

      {/* Animated glow */}
      <div 
        ref={glowRef}
        className="absolute top-[20%] right-[25%] w-[600px] h-[600px] max-w-[100vw] pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(circle, rgba(229, 57, 53, 0.18), transparent 60%)',
          filter: 'blur(40px)',
        }}
      />
      
      {/* Orbital lines SVG */}
      <svg 
        ref={orbitRef}
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[60vw] h-[80vh] pointer-events-none z-[2]"
        viewBox="0 0 500 600"
        fill="none"
        style={{ strokeDasharray: 2000 }}
      >
        <ellipse 
          cx="250" cy="300" rx="220" ry="280" 
          stroke="rgba(229, 57, 53, 0.15)" 
          strokeWidth="1"
        />
        <ellipse 
          cx="250" cy="300" rx="170" ry="220" 
          stroke="rgba(229, 57, 53, 0.1)" 
          strokeWidth="1"
        />
        <ellipse 
          cx="250" cy="300" rx="120" ry="160" 
          stroke="rgba(229, 57, 53, 0.08)" 
          strokeWidth="1"
        />
      </svg>

      <div className="w-full h-full flex items-start lg:items-center pt-24 lg:pt-0 px-6 lg:px-12 xl:px-20 relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div ref={textColumnRef} className="relative z-10 max-w-xl" style={{ perspective: '1000px' }}>
            <span 
              ref={eyebrowRef}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest border border-white/20 bg-white/10 text-white/90 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-fortivex-red shrink-0" aria-hidden />
              Software Engineering Studio
            </span>
            
            <h1 
              ref={headlineRef}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold text-white mb-6 flex flex-col gap-4 sm:gap-5"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="word inline-block">Build.</span>
              <span className="word inline-block">Automate.</span>
              <span className="word inline-block text-fortivex-red">Scale.</span>
            </h1>
            
            <p 
              ref={subheadlineRef}
              className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-md"
            >
              We design, build, and automate systems that help teams ship faster and operate smarter.
            </p>
            
            <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                onClick={(e) => handleSectionLinkClick(e, '#contact')}
                className="btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Calendar size={18} />
                  Book a discovery call
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-fortivex-red to-red-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#work"
                onClick={(e) => handleSectionLinkClick(e, '#work')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-colors duration-300 bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/50 group"
              >
                See our work
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-[opacity,transform]" />
              </a>
            </div>
          </div>

          {/* 3D Spline scene — anchored with insets (no dynamic center) so it never overflows or gets cut */}
          <div 
            ref={imageCardRef}
            className="relative lg:absolute lg:top-4 lg:right-6 lg:bottom-4 lg:left-auto lg:w-[56vw] lg:max-w-[56vw] w-full max-lg:max-h-[55vh]"
            style={{ perspective: '1200px' }}
          >
            <div className="relative w-full h-full min-h-[320px] overflow-hidden group rounded-2xl">
              {/* Soft spotlight to tie 3D into hero palette */}
              <Spotlight className="-top-40 left-0 md:left-1/4 md:-top-20" fill="rgba(229, 57, 53, 0.06)" />
              {/* Instant poster so 3D area never looks empty; fades out when Spline is ready.
                  Shows its own spinner since it sits above (and hides) Spline's Suspense fallback. */}
              <div
                aria-hidden
                className="absolute inset-0 z-[1] flex items-center justify-center transition-opacity duration-700 ease-out pointer-events-none"
                style={{
                  opacity: splineReady ? 0 : 1,
                  background: 'linear-gradient(145deg, rgba(20,20,22,0.97) 0%, rgba(10,10,12,0.98) 50%, rgba(229,57,53,0.08) 100%)',
                  boxShadow: 'inset 0 0 120px rgba(229,57,53,0.03)',
                }}
              >
                <div className="w-8 h-8 rounded-full border-2 border-fortivex-red/50 border-t-fortivex-red animate-spin motion-reduce:animate-none" />
              </div>
              {/* Spline 3D scene — loads under poster; onLoad hides poster.
                  No transform here: Spline's own mouse-look math reads this
                  container's bounding rect, and a CSS scale transform (even
                  mid-transition) desyncs that from the canvas's actual size,
                  making the robot's pose swing erratically on hover. */}
              <div className="absolute inset-0">
                <SplineScene
                    scene={SPLINE_SCENE_URL}
                    className="w-full h-full"
                    onLoad={() => setSplineReady(true)}
                  />
              </div>
              {/* Edge gradients so 3D fades into hero background (one continuous surface) */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  background: [
                    'linear-gradient(to right, rgba(10,10,10,0.85) 0%, transparent 35%)',
                    'linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 45%)',
                    'linear-gradient(to left, transparent 95%, rgba(10,10,10,0.4) 100%)',
                  ].join(', '),
                }}
              />
              
              {/* Stats bar — subtle, part of the scene not a separate card */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Projects Delivered</p>
                  <p className="text-2xl font-heading font-semibold text-white">30+</p>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Client Satisfaction</p>
                  <p className="text-2xl font-heading font-semibold text-fortivex-red">98%</p>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Years Experience</p>
                  <p className="text-2xl font-heading font-semibold text-white">4+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
