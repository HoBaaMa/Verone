import type { CategoryService } from "../contracts";
import { categories } from "@/data/mock/categories";
import { localizeCategory } from "@/data/mock/i18n/localize";
import { withLatency } from "./latency";

export const mockCategoryService: CategoryService = {
  async getCategories(lang = "en") {
    return withLatency(
      categories.map((c) => localizeCategory(c, lang)),
      0,
    );
  },
  async getCategoryBySlug(slug, lang = "en") {
    const category = categories.find((c) => c.slug === slug);
    return withLatency(category ? localizeCategory(category, lang) : null, 0);
  },
};
