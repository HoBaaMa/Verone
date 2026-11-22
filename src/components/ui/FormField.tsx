import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { useT } from "@/i18n/useT";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  error?: string;
  hint?: ReactNode;
}

/**
 * Number-like fields (phone, card, ZIP) are `dir="ltr"` so typed values read
 * correctly; on Arabic pages an empty field still flows RTL so the placeholder
 * sits on the right like every other field.
 */
export const rtlPlaceholder = "rtl:placeholder-shown:[direction:rtl]";

const inputClass =
  "h-12 w-full rounded-xl border bg-white px-3.5 text-sm text-cocoa-900 transition-colors placeholder:text-taupe-500 focus:border-cocoa-900 focus:outline-none " +
  rtlPlaceholder;

export function FieldShell({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="text-xs text-sale">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-msg`} className="text-[11px] text-taupe-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function TextField({ label, error, hint, ...props }: FieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(inputClass, error ? "border-sale" : "border-sand-300")}
        {...props}
      />
    </FieldShell>
  );
}

export function PasswordField({ label, error, hint, ...props }: FieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const { m } = useT();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          className={cn(inputClass, "pe-10", error ? "border-sale" : "border-sand-300")}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? m.pages.hidePassword : m.pages.showPassword}
          aria-pressed={visible}
          className="absolute top-1/2 end-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-taupe-600 transition-colors hover:text-cocoa-900"
        >
          {visible ? (
            <EyeOff className="size-[18px]" strokeWidth={1.75} />
          ) : (
            <Eye className="size-[18px]" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </FieldShell>
  );
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  label: string;
  error?: string;
  hint?: ReactNode;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({
  label,
  error,
  hint,
  options,
  placeholder,
  ...props
}: SelectFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          className={cn(
            inputClass,
            "cursor-pointer appearance-none pe-10",
            !props.value && "text-taupe-500",
            error ? "border-sale" : "border-sand-300",
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-cocoa-900">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 end-3.5 size-4 -translate-y-1/2 text-taupe-600"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
    </FieldShell>
  );
}

interface TextAreaFieldProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> {
  label: string;
  error?: string;
  hint?: ReactNode;
}

export function TextAreaField({ label, error, hint, ...props }: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(
          "min-h-24 w-full resize-none rounded-xl border bg-white px-3.5 py-3 text-sm text-cocoa-900 transition-colors placeholder:text-taupe-500 focus:border-cocoa-900 focus:outline-none",
          error ? "border-sale" : "border-sand-300",
        )}
        {...props}
      />
    </FieldShell>
  );
}

/** Large selectable card used for delivery and payment choices. */
export function RadioCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  aside,
  icon,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: ReactNode;
  description?: ReactNode;
  aside?: ReactNode;
  icon?: ReactNode;
  /** Extra content revealed while selected (e.g. card fields). */
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white transition-[border-color,box-shadow]",
        checked
          ? "border-cocoa-900 shadow-[0_0_0_1px_var(--color-cocoa-900)]"
          : "border-sand-300 hover:border-sand-400",
      )}
    >
      <label className="flex cursor-pointer items-center gap-3.5 p-4">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-full border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cocoa-900",
            checked ? "border-cocoa-900" : "border-sand-400",
          )}
        >
          <span
            className={cn(
              "size-2.5 rounded-full bg-cocoa-900 transition-transform",
              checked ? "scale-100" : "scale-0",
            )}
          />
        </span>
        {icon && <span className="shrink-0 text-cocoa-900">{icon}</span>}
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-medium tracking-tight">{title}</span>
          {description && (
            <span className="mt-0.5 block text-[13px] text-taupe-600">{description}</span>
          )}
        </span>
        {aside && <span className="shrink-0 text-[14px] font-medium tabular-nums">{aside}</span>}
      </label>
      {checked && children && (
        <div className="border-t border-cream-200 px-4 pt-4 pb-5">{children}</div>
      )}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl bg-sale/10 px-3.5 py-2.5 text-[13px] text-sale">
      {message}
    </p>
  );
}
