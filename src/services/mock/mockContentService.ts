import type { ContentService } from "../contracts";
import { concernTiles } from "@/data/mock/concerns";
import { heroSlides } from "@/data/mock/heroSlides";
import { localizeConcernTile, localizeHeroSlide } from "@/data/mock/i18n/localize";
import { withLatency } from "./latency";

export const mockContentService: ContentService = {
  async getHeroSlides(lang = "en") {
    return withLatency(
      heroSlides.map((s) => localizeHeroSlide(s, lang)),
      0,
    );
  },
  async getConcernTiles(lang = "en") {
    return withLatency(
      concernTiles.map((t) => localizeConcernTile(t, lang)),
      0,
    );
  },
};
