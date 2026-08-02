import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import WhatsAppMock from '@/components/WhatsAppMock';
import AgentActivityFeed from '@/components/AgentActivityFeed';

type Mode = 'chat' | 'agent';

const TABS: { id: Mode; label: string }[] = [
  { id: 'chat', label: 'Customer chat' },
  { id: 'agent', label: 'Background agent' },
];

/**
 * A WhatsApp conversation only proves the reactive half of "AI agent" — a
 * customer has to message first. This toggle sits above the same hero
 * widget so the other half (autonomous work, no one typing) gets equal
 * billing, without adding a second visual or any extra scroll length.
 */
export default function HeroDemoWidget({ className = '' }: { className?: string }) {
  const [mode, setMode] = useState<Mode>('chat');
  const reduceMotion = useReducedMotion();
  const tablistId = useId();

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Hero demo"
        className="w-full max-w-sm mx-auto mb-3 flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/5"
      >
        {TABS.map((tab) => {
          const selected = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${tablistId}-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${tablistId}-panel`}
              onClick={() => setMode(tab.id)}
              className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                selected
                  ? 'bg-fortivex-red text-white'
                  : 'text-white/60 hover:text-white/90'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${tablistId}-panel`}
        role="tabpanel"
        aria-labelledby={`${tablistId}-${mode}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {mode === 'chat' ? <WhatsAppMock /> : <AgentActivityFeed />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
