import type { Lang } from "@/i18n/config";
import type { CartItem } from "@/types";

/** Name, subtitle and size of a cart line in the given language, with the snapshot as fallback. */
export function itemTitle(
  item: Pick<CartItem, "name" | "subtitle" | "size" | "titles">,
  lang: Lang,
) {
  return item.titles?.[lang] ?? { name: item.name, subtitle: item.subtitle, size: item.size };
}
