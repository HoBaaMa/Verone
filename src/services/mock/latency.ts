/** Simulates network latency so loading states are exercised during development. */
export const withLatency = <T>(value: T, ms = 180): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));
