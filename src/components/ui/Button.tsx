import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Link, type LinkProps } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-cocoa-900 text-white hover:bg-cocoa-700",
  outline: "border border-cocoa-900 text-cocoa-900 hover:bg-cocoa-900 hover:text-white",
  light: "bg-white text-cocoa-900 shadow-soft hover:bg-cream-100",
  ghost: "text-cocoa-900 hover:bg-cream-100",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

const base =
  "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium transition-[color,background-color,border-color,box-shadow,scale] duration-200 active:scale-[0.97] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:active:scale-100 disabled:opacity-45";

export const buttonClasses = (
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) => cn(base, variants[variant], sizes[size], className);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />
  );
});

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

/** Pill CTA with a trailing circular arrow, as used throughout the editorial surfaces. */
export function ArrowPill({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-11 items-center gap-3 rounded-full pe-1.5 ps-5 text-sm font-medium transition-colors",
        tone === "light"
          ? "bg-white text-cocoa-900 group-hover:bg-cream-100"
          : "bg-cocoa-900 text-white",
      )}
    >
      {children}
      <span
        className={cn(
          "grid size-8 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45",
          tone === "light" ? "bg-cream-100" : "bg-white/10",
        )}
      >
        <ArrowUpRight className="size-4" strokeWidth={1.75} />
      </span>
    </span>
  );
}
