import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bot, Check } from 'lucide-react';

/**
 * Self-built WhatsApp conversation mockup for the hero — replaces the old
 * Spline 3D robot. No network asset: it's the actual visual the brief asks
 * for ("a WhatsApp bot conversation"), styled to match WhatsApp's own dark
 * theme so it reads as a real screenshot rather than a generic illustration.
 */

type Step = 'customer' | 'typing' | 'bot' | 'chips' | 'done';

const STEP_ORDER: Step[] = ['customer', 'typing', 'bot', 'chips', 'done'];
const STEP_DELAY_MS = 900;

export default function WhatsAppMock({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>(reduceMotion ? 'done' : 'customer');

  useEffect(() => {
    if (reduceMotion) return;
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex >= STEP_ORDER.length - 1) return;
    const timer = setTimeout(() => setStep(STEP_ORDER[currentIndex + 1]), STEP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [step, reduceMotion]);

  const showTyping = step === 'typing';
  const showBot = step === 'bot' || step === 'chips' || step === 'done';
  const showChips = step === 'chips' || step === 'done';

  return (
    <div
      className={`relative w-full max-w-sm mx-auto rounded-3xl overflow-hidden border border-white/10 bg-[#0b141a] shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#202c33] border-b border-white/5">
        <div className="w-9 h-9 rounded-full bg-fortivex-red/20 flex items-center justify-center shrink-0">
          <Bot size={18} className="text-fortivex-red" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">Fortivex Assistant</p>
          <p className="text-xs text-emerald-400/80">online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 px-4 py-5 min-h-[220px] justify-end">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="self-start max-w-[78%] rounded-2xl rounded-tl-sm bg-[#202c33] px-3.5 py-2 text-sm text-gray-100"
        >
          Hi! Do you deliver to Pretoria?
        </motion.div>

        {showTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="self-end flex items-center gap-1 rounded-2xl rounded-tr-sm bg-[#005c4b] px-4 py-2.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}

        {showBot && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="self-end max-w-[82%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-3.5 py-2 text-sm text-white"
          >
            Yes! We deliver across Gauteng 🚚 Want me to check an order or start a new one?
            <span className="flex items-center justify-end gap-0.5 mt-1 -mb-0.5">
              <Check size={13} className="text-sky-300 -mr-1.5" strokeWidth={2.5} />
              <Check size={13} className="text-sky-300" strokeWidth={2.5} />
            </span>
          </motion.div>
        )}

        {showChips && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="self-end flex flex-wrap justify-end gap-2 pt-1"
          >
            {['Check order', 'New order'].map((label) => (
              <span
                key={label}
                className="text-xs font-medium text-emerald-300 border border-emerald-400/30 rounded-full px-3 py-1.5 bg-emerald-400/5"
              >
                {label}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
