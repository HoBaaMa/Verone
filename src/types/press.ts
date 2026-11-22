/** Visual treatment used to render a publication's wordmark in type. */
export type WordmarkStyle = "serif" | "serif-italic" | "sans-bold" | "sans-wide" | "sans-light";

export interface PressMention {
  id: string;
  name: string;
  /** Text shown as the wordmark; defaults to `name`. */
  wordmark?: string;
  style: WordmarkStyle;
}
