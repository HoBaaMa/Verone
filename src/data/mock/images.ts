/** Builds a sized Unsplash CDN URL from a photo id. */
export function unsplash(id: string, width = 1080): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${width}`;
}
