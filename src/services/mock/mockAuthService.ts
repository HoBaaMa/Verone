import type { AuthService } from "../contracts";
import { AuthError, type User } from "@/types";
import { withLatency } from "./latency";

/**
 * DEMO ONLY — accounts live in this browser's localStorage so the flows can be
 * exercised without a backend. Passwords are SHA-256 hashed, but this is not
 * real authentication; replace with the API-backed service before launch.
 */
const STORAGE_KEY = "verone-demo-accounts";

interface StoredAccount extends User {
  passwordHash: string;
}

const normalise = (identifier: string) => identifier.trim().toLowerCase().replace(/[\s-]/g, "");

async function hash(password: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

function readAccounts(): StoredAccount[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as StoredAccount[];
  } catch {
    return [];
  }
}

const toUser = ({ passwordHash: _omit, ...user }: StoredAccount): User => user;

export const mockAuthService: AuthService = {
  async signIn({ identifier, password }) {
    const account = readAccounts().find((a) => normalise(a.identifier) === normalise(identifier));
    if (!account || account.passwordHash !== (await hash(password))) {
      await withLatency(null, 400);
      throw new AuthError(
        "invalid_credentials",
        "That email/phone and password don’t match our records.",
      );
    }
    return withLatency(toUser(account), 400);
  },
  async signUp({ fullName, identifier, password }) {
    const accounts = readAccounts();
    if (accounts.some((a) => normalise(a.identifier) === normalise(identifier))) {
      await withLatency(null, 400);
      throw new AuthError("account_exists", "An account with this email or phone already exists.");
    }
    const account: StoredAccount = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      identifier: identifier.trim(),
      createdAt: new Date().toISOString(),
      passwordHash: await hash(password),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...accounts, account]));
    return withLatency(toUser(account), 400);
  },
  async requestPasswordReset() {
    await withLatency(null, 400);
  },
  async signOut() {
    await withLatency(null, 0);
  },
};
