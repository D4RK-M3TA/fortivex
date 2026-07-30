import { useId } from 'react';
import type { LucideIcon } from 'lucide-react';

/**
 * On-brand replacement for stock/AI-generated imagery: a dark panel with a
 * diagonal grid, a soft red glow, and one oversized faint icon tying it to
 * the section's actual content. Pure CSS/SVG — no network request, no CLS.
 */
export function PatternPanel({
  icon: Icon,
  className = '',
}: {
  icon: LucideIcon;
  className?: string;
}) {
  const gridId = useId();

  return (
    <div
      aria-hidden
      className={`relative overflow-hidden bg-gradient-to-br from-[#121215] via-fortivex-black to-[#1a0e0e] ${className}`}
    >
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0 L0 40" fill="none" stroke="rgba(229,57,53,0.35)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(229,57,53,0.35), transparent 70%)', filter: 'blur(40px)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="w-1/3 h-1/3 text-white/20" strokeWidth={1} />
      </div>
    </div>
  );
}
