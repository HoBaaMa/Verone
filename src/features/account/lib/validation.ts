import type { Messages } from "@/i18n/messages/en";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9\s-]{7,15}$/;

export const MIN_PASSWORD_LENGTH = 8;

/** Validators return a message key; components resolve it in the active language. */
export type AccountErrorKey = keyof Messages["account"]["errors"];

export function validateIdentifier(value: string): AccountErrorKey | undefined {
  const v = value.trim();
  if (!v) return "identifierRequired";
  if (!EMAIL.test(v) && !PHONE.test(v)) return "identifierInvalid";
}

export function validatePassword(
  value: string,
  { strict }: { strict: boolean },
): AccountErrorKey | undefined {
  if (!value) return "passwordRequired";
  if (strict && value.length < MIN_PASSWORD_LENGTH) return "passwordShort";
}

export function validateFullName(value: string): AccountErrorKey | undefined {
  if (value.trim().length < 2) return "fullNameRequired";
}
