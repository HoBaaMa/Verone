import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DisplayHeading } from "@/components/ui/DisplayHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { useArticles } from "../hooks/useArticles";
import { ArticleCard } from "./ArticleCard";
import { Reveal, staggerDelay } from "@/components/ui/Reveal";
import { useT } from "@/i18n/useT";

export function JournalSection() {
  const { data: articles } = useArticles(3);
  const { m } = useT();

  return (
    <section className="pt-28 sm:pt-36" aria-labelledby="journal-heading">
      <Container>
        <Reveal className="text-center">
          <DisplayHeading lead={m.journal.lead} muted={m.journal.muted} />
          <span id="journal-heading" className="sr-only">
            {m.journal.fromJournal}
          </span>
        </Reveal>
        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {articles
            ? articles.map((article, index) => (
                <Reveal key={article.id} className="grid" delay={staggerDelay(index, 3, 100)}>
                  <ArticleCard article={article} />
                </Reveal>
              ))
            : Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-[440px] rounded-[var(--radius-card)]" />
              ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/journal"
            className="text-sm font-medium underline underline-offset-4 hover:text-cocoa-700"
          >
            {m.journal.viewAll}
          </Link>
        </div>
      </Container>
    </section>
  );
}
