import { useState, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { handleSectionLinkClick } from '@/lib/scroll';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
];

export default function Navbar() {
  // Whole site is dark now, so the nav only ever toggles transparent (over
  // hero) vs. translucent-blurred (elsewhere) — never light vs. dark text.
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let disconnect: (() => void) | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const setup = () => {
      const hero = document.getElementById('hero');
      if (!hero) return false;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          setIsHeroInView(entry.intersectionRatio >= 0.1);
        },
        { threshold: [0, 0.05, 0.1, 0.2, 0.5, 1], rootMargin: '0px' }
      );

      observer.observe(hero);
      disconnect = () => observer.disconnect();
      return true;
    };

    if (!setup()) timeoutId = setTimeout(setup, 100);

    return () => {
      clearTimeout(timeoutId);
      disconnect?.();
    };
  }, []);

  const reduceMotion = useReducedMotion();

  // Mobile links also need to close the menu after navigating
  const goToSectionMobile = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    handleSectionLinkClick(e, href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={reduceMotion ? false : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          isHeroInView
            ? 'bg-transparent'
            : 'bg-fortivex-black/85 backdrop-blur-2xl border-b border-fortivex-border-subtle'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo — dark variant everywhere, matching the site's dark base */}
            <a
              href="#hero"
              onClick={(e) => handleSectionLinkClick(e, '#hero')}
              className="flex items-center gap-2 text-white transition-transform duration-300 hover:scale-105"
            >
              <Logo variant="dark" height={32} className="h-8 lg:h-10 w-auto" />
            </a>

            {/* Desktop Navigation */}
            <div
              className={`hidden lg:flex items-center gap-1 backdrop-blur-xl rounded-full px-2 py-1.5 border transition-colors duration-300 ${
                isHeroInView ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'
              }`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleSectionLinkClick(e, link.href)}
                  className="px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 text-white/90 hover:text-white hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <a
                href="#contact"
                onClick={(e) => handleSectionLinkClick(e, '#contact')}
                className="btn-primary text-sm"
              >
                Contact
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden p-2.5 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ overscrollBehavior: 'contain' }}
          >
            <div
              className="absolute inset-0 bg-fortivex-black/95 backdrop-blur-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div
              className="relative flex flex-col items-center justify-center h-full gap-6"
              style={{
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
              }}
            >
              {/* Mobile Logo */}
              <div className="text-white mb-8">
                <Logo variant="dark" height={48} className="h-12 w-auto" />
              </div>
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : index * 0.04 }}
                  onClick={(e) => goToSectionMobile(e, link.href)}
                  className="text-3xl font-heading font-medium text-white hover:text-fortivex-red transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.12 }}
                onClick={(e) => goToSectionMobile(e, '#contact')}
                className="btn-primary mt-6"
              >
                Contact
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
