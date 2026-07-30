/**
 * Fortivex wordmark logo: "Fortivex." with red accent dot.
 * variant "light" = black text (white/light bg), "dark" = light text (dark bg).
 */

const RED_DOT = '#E53935';
const VIEWBOX_WIDTH = 140;
const VIEWBOX_HEIGHT = 32;

export type LogoProps = {
  className?: string;
  /** Height in pixels; width scales automatically. */
  height?: number;
  /** "light" = black text for white bg, "dark" = light text for dark bg. */
  variant?: 'light' | 'dark';
};

export default function Logo({ className = '', height = 32, variant = 'light' }: LogoProps) {
  const textFill = variant === 'light' ? '#0a0a0a' : '#ffffff';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      height={height}
      className={className}
      aria-label="Fortivex"
    >
      <text
        x={0}
        y={24}
        fontFamily="'Space Grotesk', system-ui, sans-serif"
        fontSize={20}
        fontWeight="700"
        fill={textFill}
      >
        fortivex
      </text>
      <circle cx={80} cy={22} r={3.5} fill={RED_DOT} />
    </svg>
  );
}
