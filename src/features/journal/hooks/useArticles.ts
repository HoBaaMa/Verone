import { articleService } from "@/services";
import { useAsync } from "@/lib/useAsync";
import { useLang } from "@/i18n/useLang";

export function useArticles(limit?: number) {
  const lang = useLang();
  return useAsync(() => articleService.getArticles(limit, lang), [limit, lang]);
}
