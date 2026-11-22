import type { ElementType, ReactNode } from "react";
import { useInView } from "@/lib/useInView";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in milliseconds. */
  delay?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Fades and lifts content in the first time it scrolls into view.
 * Reduced-motion users see content immediately.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      style={inView && delay ? { animationDelay: `${delay}ms` } : undefined}
      className={cn(
        inView
          ? "animate-reveal-up motion-reduce:animate-none"
          : "opacity-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Delay for item `index` in a grid, staggering across a row and restarting each row. */
export const staggerDelay = (index: number, perRow: number, step = 80) => (index % perRow) * step;
