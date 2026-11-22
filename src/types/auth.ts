export interface User {
  id: string;
  fullName: string;
  /** Email address or phone number the user signs in with. */
  identifier: string;
  createdAt: string;
}

export interface SignInRequest {
  identifier: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  identifier: string;
  password: string;
}

/** Error codes mirror the planned API's problem-details `code` field. */
export type AuthErrorCode = "invalid_credentials" | "account_exists";

export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
