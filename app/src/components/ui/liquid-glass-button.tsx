/**
 * Liquid / glass-style button for CTA — FortiVex themed (red, glass, rounded-full).
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const liquidButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,background-color,border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fortivex-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-fortivex-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'text-white border border-white/20 bg-fortivex-red/90 backdrop-blur-sm hover:bg-fortivex-red hover:scale-[1.02] hover:border-white/30 active:scale-[0.98] shadow-[0_8px_32px_rgba(229,57,53,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_12px_40px_rgba(229,57,53,0.4)]',
      },
      size: {
        default: 'h-11 px-6 py-2 text-sm',
        lg: 'h-12 px-8 py-3 text-base',
        xl: 'h-14 px-10 py-3.5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'xl',
    },
  }
);

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidButtonVariants> {
  asChild?: boolean;
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(liquidButtonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
LiquidButton.displayName = 'LiquidButton';

export { LiquidButton, liquidButtonVariants };
