import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { useT } from "@/i18n/useT";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Local-only signup; the API call will be wired in once the backend exists. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const { m } = useT();
  const [status, setStatus] = useState<"idle" | "invalid" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setStatus(EMAIL_PATTERN.test(email.trim()) ? "done" : "invalid");
  };

  if (status === "done") {
    return (
      <p className="flex items-center gap-3 text-sm text-white/90">
        <span className="grid size-8 place-items-center rounded-full bg-white text-cocoa-900">
          <Check className="size-4" />
        </span>
        {m.newsletter.done}
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex w-full max-w-md flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "invalid") setStatus("idle");
          }}
          placeholder={m.newsletter.placeholder}
          dir="ltr"
          aria-label={m.newsletter.label}
          aria-invalid={status === "invalid"}
          className="h-11 w-0 min-w-0 flex-1 rounded-full rtl:placeholder-shown:[direction:rtl] border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/45 focus:border-white/50 focus:outline-none"
        />
        <button
          type="submit"
          className="group inline-flex h-11 shrink-0 items-center justify-between gap-3 rounded-full bg-white pe-1.5 ps-5 text-sm font-medium text-cocoa-900 transition-colors hover:bg-cream-100"
        >
          {m.newsletter.subscribe}
          <span className="grid size-8 place-items-center rounded-full bg-cream-100 transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </span>
        </button>
      </div>
      <p className="mt-3 text-xs text-white/45">
        {status === "invalid" ? (
          <span className="text-[#ffb4b0]">{m.newsletter.invalid}</span>
        ) : (
          m.newsletter.legal
        )}
      </p>
    </form>
  );
}
