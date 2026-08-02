import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bot } from 'lucide-react';

/**
 * The other half of "AI agent" that a chat mockup can't show: work happening
 * autonomously, with no customer typing anything. Same card footprint as
 * WhatsAppMock so the two can swap in the hero without layout shift.
 */

type EventTone = 'info' | 'alert' | 'action' | 'success';

type LogEvent = { time: string; text: string; tone: EventTone };

const EVENTS: LogEvent[] = [
  { time: '10:32', text: 'Checked inventory levels', tone: 'info' },
  { time: '10:33', text: 'Low stock flagged: Item #4521', tone: 'alert' },
  { time: '10:34', text: 'Reorder request sent to supplier', tone: 'action' },
  { time: '10:41', text: 'New lead synced to CRM', tone: 'success' },
  { time: '10:47', text: 'Invoice generated & emailed', tone: 'success' },
];

const TONE_DOT: Record<EventTone, string> = {
  info: 'bg-gray-400',
  alert: 'bg-amber-400',
  action: 'bg-fortivex-red',
  success: 'bg-emerald-400',
};

const STEP_DELAY_MS = 750;

export default function AgentActivityFeed({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? EVENTS.length : 0);

  useEffect(() => {
    if (reduceMotion || count >= EVENTS.length) return;
    const timer = setTimeout(() => setCount((c) => c + 1), STEP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [count, reduceMotion]);

  const done = count >= EVENTS.length;

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
          <p className="text-sm font-medium text-white truncate">Fortivex Agent</p>
          <p className="text-xs text-fortivex-red/90">running in the background</p>
        </div>
      </div>

      {/* Log */}
      <div className="flex flex-col gap-2.5 px-4 py-5 min-h-[220px] justify-end font-mono">
        {EVENTS.slice(0, count).map((event) => (
          <motion.div
            key={event.time + event.text}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex items-start gap-2.5 text-xs"
          >
            <span className="text-gray-500 shrink-0 pt-0.5">{event.time}</span>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${TONE_DOT[event.tone]}`} />
            <span className="text-gray-200">{event.text}</span>
          </motion.div>
        ))}

        {done && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2.5 text-xs pt-1"
          >
            <span className="text-gray-600 shrink-0">...</span>
            <motion.span
              className="w-1.5 h-1.5 rounded-full shrink-0 bg-fortivex-red"
              animate={reduceMotion ? {} : { opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="text-gray-500 italic">Watching for the next event</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
