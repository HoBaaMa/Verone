import type { ArticleService } from "../contracts";
import { articles } from "@/data/mock/articles";
import { localizeArticle } from "@/data/mock/i18n/localize";
import { withLatency } from "./latency";

export const mockArticleService: ArticleService = {
  async getArticles(limit, lang = "en") {
    const sorted = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    const list = limit ? sorted.slice(0, limit) : sorted;
    return withLatency(list.map((a) => localizeArticle(a, lang)));
  },
  async getArticleBySlug(slug, lang = "en") {
    const article = articles.find((a) => a.slug === slug);
    return withLatency(article ? localizeArticle(article, lang) : null);
  },
};
