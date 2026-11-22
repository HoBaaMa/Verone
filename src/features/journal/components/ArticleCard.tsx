import { Link } from "@/i18n/navigation";
import type { Article } from "@/types";
import { ArrowPill } from "@/components/ui/Button";
import { useT } from "@/i18n/useT";

export function ArticleCard({ article }: { article: Article }) {
  const { m } = useT();
  return (
    <Link
      to={`/journal/${article.slug}`}
      className="group flex flex-col rounded-[var(--radius-card)] bg-cream-100 p-2.5 transition-colors hover:bg-cream-200/70"
    >
      <div className="aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-card)-0.375rem)]">
        <img
          src={article.coverImage}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <h3 className="text-[22px] leading-[1.1] font-semibold tracking-[-0.03em]">
          {article.title}
        </h3>
        <p className="mt-2.5 text-[15px] leading-snug text-taupe-500">{article.excerpt}</p>
        <div className="mt-auto pt-7">
          <ArrowPill>{m.journal.readMore}</ArrowPill>
        </div>
      </div>
    </Link>
  );
}
