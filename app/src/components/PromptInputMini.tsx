import { useRef, useLayoutEffect, type KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_HEIGHT_PX = 88;

/**
 * A trimmed-down take on a ChatGPT/Cursor-style composer: kept the part that
 * actually earns its keep (an auto-resizing textarea that feels good to type
 * into), dropped the parts that didn't fit a scripted business-bot demo
 * (model/effort pickers, voice recording, image attachments).
 */
export default function PromptInputMini({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Ask something…',
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSubmit = value.trim() !== '' && !disabled;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) onSubmit();
    }
  };

  return (
    <div
      className={cn(
        'flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 focus-within:border-fortivex-red/40 transition-colors',
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder={placeholder}
        aria-label="Message the demo bot"
        className="flex-1 resize-none bg-transparent text-sm text-gray-100 placeholder:text-gray-500 outline-none disabled:opacity-50 leading-snug py-1"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-label="Send message"
        className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-fortivex-red text-white disabled:opacity-30 disabled:pointer-events-none hover:opacity-90 transition-opacity"
      >
        <ArrowUp size={16} strokeWidth={2.25} />
      </button>
    </div>
  );
}
