import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Mail, MapPin, MessageCircle, CheckCircle } from 'lucide-react';

const SUPPORT_EMAIL = 'fortivex.support@gmail.com';
const WHATSAPP_URL = 'https://wa.me/27683572983'; // +27 68 357 2983
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID as string | undefined;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    if (prefersReducedMotion()) {
      gsap.set(content, { clearProps: 'all' });
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
            end: 'top 55%',
            scrub: 0.25,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    if (!FORMSPREE_FORM_ID) {
      setSubmitError(
        'Formspree is not configured. Add VITE_FORMSPREE_FORM_ID to your .env (see .env.example).'
      );
      toast.error('Form not configured. Add Formspree form ID to .env');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          notes: formData.notes,
          _replyto: formData.email,
          _subject: `Contact form: ${formData.name}${formData.company ? ` – ${formData.company}` : ''}`,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setIsSubmitted(true);
      toast.success('Thank you! We will get back to you within 48 hours.');
      setFormData({ name: '', email: '', company: '', notes: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      setSubmitError('Something went wrong. Please try emailing us directly.');
      toast.error('Submission failed. Try emailing us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="section-flowing bg-white relative pb-0"
      style={{ zIndex: 100 }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-fortivex-red/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full px-6 lg:px-12 xl:px-20 relative">
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 max-w-5xl mx-auto mb-16">
          {/* Left: compact form */}
          <div className="lg:col-span-7">
            <span className="glass-pill mb-3 inline-block text-xs">Get in touch</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-fortivex-text-primary mb-2">
              Contact
            </h2>
            <p className="text-fortivex-text-secondary text-sm mb-6 max-w-md">
              Share a few details and we'll schedule a 20-minute discovery call.
            </p>

            {isSubmitted ? (
              <div className="glass-card p-6 text-center">
                <CheckCircle size={48} className="text-fortivex-red mx-auto mb-3" />
                <h3 className="font-heading text-xl font-semibold text-fortivex-text-primary mb-1">
                  Message sent!
                </h3>
                <p className="text-fortivex-text-secondary text-sm">
                  We'll get back to you within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label className="block text-xs font-medium text-fortivex-text-secondary mb-1.5">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 text-sm rounded-lg bg-fortivex-surface-glass border border-fortivex-border-subtle text-fortivex-text-primary placeholder:text-fortivex-text-secondary/50 focus:outline-none focus:border-fortivex-red transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-field">
                    <label className="block text-xs font-medium text-fortivex-text-secondary mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2.5 text-sm rounded-lg bg-fortivex-surface-glass border border-fortivex-border-subtle text-fortivex-text-primary placeholder:text-fortivex-text-secondary/50 focus:outline-none focus:border-fortivex-red transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label className="block text-xs font-medium text-fortivex-text-secondary mb-1.5">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-fortivex-surface-glass border border-fortivex-border-subtle text-fortivex-text-primary placeholder:text-fortivex-text-secondary/50 focus:outline-none focus:border-fortivex-red transition-colors"
                    placeholder="Your company"
                  />
                </div>
                <div className="form-field">
                  <label className="block text-xs font-medium text-fortivex-text-secondary mb-1.5">Project notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-fortivex-surface-glass border border-fortivex-border-subtle text-fortivex-text-primary placeholder:text-fortivex-text-secondary/50 focus:outline-none focus:border-fortivex-red transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                {submitError && (
                  <p className="text-sm text-red-600">
                    {submitError}{' '}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="underline hover:text-fortivex-red">
                      Email us
                    </a>
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  {isSubmitting ? 'Sending…' : 'Request a call'}
                </button>
              </form>
            )}
          </div>

          {/* Right: contact card */}
          <div className="lg:col-span-5 flex lg:justify-end">
            <div className="w-full lg:max-w-xs glass-card p-5 h-fit space-y-4">
              <p className="text-xs font-medium text-fortivex-text-secondary uppercase tracking-wider">Reach us</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2.5 text-sm text-fortivex-text-primary hover:text-fortivex-red transition-colors"
              >
                <Mail size={16} className="text-fortivex-red shrink-0" />
                <span className="break-all">{SUPPORT_EMAIL}</span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-fortivex-text-primary hover:text-fortivex-red transition-colors"
              >
                <MessageCircle size={16} className="text-fortivex-red shrink-0" />
                Chat on WhatsApp
              </a>
              <div className="flex items-center gap-2.5 text-sm text-fortivex-text-secondary pt-1 border-t border-fortivex-border-subtle">
                <MapPin size={16} className="text-fortivex-red shrink-0" />
                Based in South Africa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer 
        ref={footerRef}
        className="w-full border-t border-fortivex-border-subtle py-10"
      >
        <div className="px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Logo and copyright */}
            <div className="flex flex-col items-center lg:items-start gap-2">
              <span className="text-fortivex-text-primary">
                <Logo variant="light" height={36} className="h-9 w-auto" />
              </span>
              <p className="text-sm text-fortivex-text-secondary">
                © 2024 Fortivex Pty Ltd. All rights reserved.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button className="text-sm text-fortivex-text-secondary hover:text-fortivex-text-primary transition-colors">
                Privacy Policy
              </button>
              <button className="text-sm text-fortivex-text-secondary hover:text-fortivex-text-primary transition-colors">
                Terms of Service
              </button>
              <div className="h-4 w-px bg-fortivex-border-subtle hidden sm:block" />
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
      </footer>
    </section>
  );
}
