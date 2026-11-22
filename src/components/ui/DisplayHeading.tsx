import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Two-tone display headline: a dark lead line with a muted follow-on line. */
export function DisplayHeading({
  lead,
  muted,
  as: Tag = "h2",
  className,
}: {
  lead: ReactNode;
  muted?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] font-semibold tracking-[var(--tracking-display)] text-cocoa-900",
        className,
      )}
    >
      <span className="block">{lead}</span>
      {muted && <span className="block text-sand-400">{muted}</span>}
    </Tag>
  );
}
