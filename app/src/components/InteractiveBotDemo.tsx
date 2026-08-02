import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bot, Check } from 'lucide-react';
import PromptInputMini from '@/components/PromptInputMini';

/**
 * A small scripted state machine, not a real AI backend — but genuinely
 * clickable, so a skeptical visitor can try the conversation themselves
 * instead of taking a static mockup's word for it.
 */
type Chip = { label: string; next: string };
type Node = { bot: string; chips: Chip[] };

const SCRIPT: Record<string, Node> = {
  start: {
    bot: "Hey! I'm the Fortivex demo bot. What can I help with?",
    chips: [
      { label: 'Check an order', next: 'checkOrder' },
      { label: 'Book a slot', next: 'bookSlot' },
      { label: 'Talk to a human', next: 'handoff' },
    ],
  },
  checkOrder: {
    bot: "Sure, what's your order number?",
    chips: [
      { label: '#A1042', next: 'orderFound' },
      { label: "I don't have it", next: 'orderLookup' },
    ],
  },
  orderFound: {
    bot: 'Found it. Order #A1042 is out for delivery, arriving today by 5pm. 📦',
    chips: [{ label: 'Talk to a human', next: 'handoff' }],
  },
  orderLookup: {
    bot: 'No problem, I can look it up by your phone number instead.',
    chips: [{ label: 'Talk to a human', next: 'handoff' }],
  },
  bookSlot: {
    bot: 'Great, what day works for you?',
    chips: [
      { label: 'Today', next: 'bookedToday' },
      { label: 'Tomorrow', next: 'bookedTomorrow' },
    ],
  },
  bookedToday: {
    bot: "Booked for today at 2pm. You'll get a WhatsApp reminder an hour before. ✅",
    chips: [{ label: 'Talk to a human', next: 'handoff' }],
  },
  bookedTomorrow: {
    bot: "Booked for tomorrow at 2pm. You'll get a WhatsApp reminder an hour before. ✅",
    chips: [{ label: 'Talk to a human', next: 'handoff' }],
  },
  handoff: {
    bot: "On it, handing you over to the team now.",
    chips: [],
  },
};

// Broad keyword fallback so typed phrases route sensibly from any node, not
// just from a chip whose label happens to contain the same word.
const INTENTS: { pattern: RegExp; next: string }[] = [
  { pattern: /order|deliver|track/i, next: 'checkOrder' },
  { pattern: /book|slot|appointment|schedule/i, next: 'bookSlot' },
  { pattern: /human|agent|person|help/i, next: 'handoff' },
];

const FALLBACK_REPLY = "I didn't quite catch that. Try asking about an order, booking a slot, or tap a reply below.";

type Message = { from: 'user' | 'bot'; text: string; id: number };

export default function InteractiveBotDemo({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [nodeId, setNodeId] = useState('start');
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: SCRIPT.start.bot, id: 0 },
  ]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const node = SCRIPT[nodeId];
  const ended = node.chips.length === 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduceMotion ? 'instant' : 'smooth' });
  }, [messages, typing, reduceMotion]);

  const respondWith = (userText: string, nextId: string | null) => {
    setMessages((prev) => [...prev, { from: 'user', text: userText, id: idRef.current++ }]);
    setTyping(true);

    const delay = reduceMotion ? 0 : 650;
    setTimeout(() => {
      setTyping(false);
      if (nextId) {
        setNodeId(nextId);
        setMessages((prev) => [...prev, { from: 'bot', text: SCRIPT[nextId].bot, id: idRef.current++ }]);
      } else {
        setMessages((prev) => [...prev, { from: 'bot', text: FALLBACK_REPLY, id: idRef.current++ }]);
      }
    }, delay);
  };

  const handleChip = (chip: Chip) => respondWith(chip.label, chip.next);

  const resolveIntent = (text: string): string | null => {
    const trimmed = text.trim().toLowerCase();
    if (!trimmed) return null;
    const chipMatch = node.chips.find(
      (c) => c.label.toLowerCase().includes(trimmed) || trimmed.includes(c.label.toLowerCase())
    );
    if (chipMatch) return chipMatch.next;
    const intent = INTENTS.find((i) => i.pattern.test(trimmed));
    return intent ? intent.next : null;
  };

  const handleTextSubmit = () => {
    const text = draft.trim();
    if (!text || typing) return;
    setDraft('');
    respondWith(text, resolveIntent(text));
  };

  const handleReset = () => {
    setNodeId('start');
    setMessages([{ from: 'bot', text: SCRIPT.start.bot, id: idRef.current++ }]);
    setTyping(false);
    setDraft('');
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0b141a] flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#202c33] border-b border-white/5 shrink-0">
        <div className="w-9 h-9 rounded-full bg-fortivex-red/20 flex items-center justify-center shrink-0">
          <Bot size={18} className="text-fortivex-red" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">Fortivex Demo Bot</p>
          <p className="text-xs text-emerald-400/80">online — type or tap a reply</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-[180px] max-h-[260px] overflow-y-auto flex flex-col gap-2 px-4 py-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={
              m.from === 'user'
                ? 'self-end max-w-[82%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-3.5 py-2 text-sm text-white'
                : 'self-start max-w-[82%] rounded-2xl rounded-tl-sm bg-[#202c33] px-3.5 py-2 text-sm text-gray-100'
            }
          >
            {m.text}
            {m.from === 'user' && (
              <span className="flex items-center justify-end gap-0.5 mt-1 -mb-0.5">
                <Check size={12} className="text-sky-300 -mr-1.5" strokeWidth={2.5} aria-hidden />
                <Check size={12} className="text-sky-300" strokeWidth={2.5} aria-hidden />
              </span>
            )}
          </motion.div>
        ))}

        {typing && (
          <div className="self-start flex items-center gap-1 rounded-2xl rounded-tl-sm bg-[#202c33] px-4 py-2.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick replies + freeform input */}
      <div className="px-4 pb-4 pt-1 shrink-0 flex flex-col gap-2 min-h-[3.25rem]">
        {ended ? (
          <button
            type="button"
            onClick={handleReset}
            className="self-start text-xs font-medium text-emerald-300 border border-emerald-400/30 rounded-full px-3 py-1.5 bg-emerald-400/5 hover:bg-emerald-400/10 transition-colors"
          >
            Start over
          </button>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {node.chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  disabled={typing}
                  onClick={() => handleChip(chip)}
                  className="text-xs font-medium text-emerald-300 border border-emerald-400/30 rounded-full px-3 py-1.5 bg-emerald-400/5 hover:bg-emerald-400/10 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <PromptInputMini
              value={draft}
              onChange={setDraft}
              onSubmit={handleTextSubmit}
              disabled={typing}
              placeholder="Or type your own question…"
            />
          </>
        )}
      </div>
    </div>
  );
}
