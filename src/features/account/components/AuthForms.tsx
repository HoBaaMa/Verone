import { useT } from "@/i18n/useT";
import { useState, type FormEvent } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services";
import { useAuthStore } from "@/store/authStore";
import { AuthError } from "@/types";
import {
  MIN_PASSWORD_LENGTH,
  type AccountErrorKey,
  validateFullName,
  validateIdentifier,
  validatePassword,
} from "../lib/validation";
import { FormError, PasswordField, TextField } from "@/components/ui/FormField";

type Errors<K extends string> = Partial<Record<K, AccountErrorKey>>;

/** Resolves an error key (or AuthError code) to text in the active language. */
function useErrorText() {
  const { m, fmt } = useT();
  return (key: AccountErrorKey | undefined) =>
    key && fmt(m.account.errors[key], { count: MIN_PASSWORD_LENGTH });
}

function SubmitButton({ busy, children }: { busy: boolean; children: string }) {
  return (
    <Button type="submit" size="lg" className="mt-2 h-12 w-full" disabled={busy} aria-busy={busy}>
      {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}

export function SignInForm({ onForgotPassword }: { onForgotPassword: () => void }) {
  const { m, fmt } = useT();
  const errText = useErrorText();
  const setUser = useAuthStore((s) => s.setUser);
  const [values, setValues] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState<Errors<"identifier" | "password">>({});
  const [formError, setFormError] = useState<AccountErrorKey>();
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next = {
      identifier: validateIdentifier(values.identifier),
      password: validatePassword(values.password, { strict: false }),
    };
    setErrors(next);
    setFormError(undefined);
    if (next.identifier || next.password) return;
    setBusy(true);
    try {
      setUser(await authService.signIn(values));
    } catch (err) {
      setFormError(err instanceof AuthError ? err.code : "generic");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <FormError message={errText(formError)} />
      <TextField
        label={m.account.identifier}
        autoComplete="username"
        inputMode="email"
        value={values.identifier}
        error={errText(errors.identifier)}
        onChange={(e) => setValues((v) => ({ ...v, identifier: e.target.value }))}
      />
      <PasswordField
        label={m.account.password}
        autoComplete="current-password"
        value={values.password}
        error={errText(errors.password)}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
      />
      <div className="-mt-1 flex justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs font-medium underline underline-offset-4 hover:text-taupe-600"
        >
          {m.account.forgot}
        </button>
      </div>
      <SubmitButton busy={busy}>{m.account.signIn}</SubmitButton>
    </form>
  );
}

export function CreateAccountForm() {
  const { m, fmt } = useT();
  const errText = useErrorText();
  const setUser = useAuthStore((s) => s.setUser);
  const [values, setValues] = useState({ fullName: "", identifier: "", password: "" });
  const [errors, setErrors] = useState<Errors<"fullName" | "identifier" | "password">>({});
  const [formError, setFormError] = useState<AccountErrorKey>();
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next = {
      fullName: validateFullName(values.fullName),
      identifier: validateIdentifier(values.identifier),
      password: validatePassword(values.password, { strict: true }),
    };
    setErrors(next);
    setFormError(undefined);
    if (next.fullName || next.identifier || next.password) return;
    setBusy(true);
    try {
      setUser(await authService.signUp(values));
    } catch (err) {
      if (err instanceof AuthError && err.code === "account_exists") {
        setErrors((current) => ({ ...current, identifier: err.code }));
      } else {
        setFormError("generic");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <FormError message={errText(formError)} />
      <TextField
        label={m.account.fullName}
        autoComplete="name"
        value={values.fullName}
        error={errText(errors.fullName)}
        onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
      />
      <TextField
        label={m.account.identifier}
        autoComplete="username"
        inputMode="email"
        value={values.identifier}
        error={errText(errors.identifier)}
        onChange={(e) => setValues((v) => ({ ...v, identifier: e.target.value }))}
      />
      <PasswordField
        label={m.account.password}
        autoComplete="new-password"
        value={values.password}
        error={errText(errors.password)}
        hint={fmt(m.account.passwordHint, { count: MIN_PASSWORD_LENGTH })}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
      />
      <SubmitButton busy={busy}>{m.account.create}</SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const { m, fmt } = useT();
  const errText = useErrorText();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<AccountErrorKey>();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const message = validateIdentifier(identifier);
    setError(message);
    if (message) return;
    setBusy(true);
    try {
      await authService.requestPasswordReset(identifier);
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] bg-cream-100 px-6 py-8 text-center">
        <MailCheck className="size-8" strokeWidth={1.5} aria-hidden />
        <p className="text-sm leading-relaxed text-taupe-600">
          {m.account.sentPrefix}{" "}
          <span className="font-medium text-cocoa-900">{identifier.trim()}</span>
          {m.account.sentSuffix}
        </p>
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium underline underline-offset-4"
        >
          {m.account.back}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-taupe-600">{m.account.forgotLead}</p>
      <TextField
        label={m.account.identifier}
        autoComplete="username"
        inputMode="email"
        value={identifier}
        error={errText(error)}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <SubmitButton busy={busy}>{m.account.sendLink}</SubmitButton>
      <button
        type="button"
        onClick={onBack}
        className="text-center text-[13px] font-medium underline underline-offset-4"
      >
        {m.account.back}
      </button>
    </form>
  );
}
