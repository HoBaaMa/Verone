import type { ReactNode } from "react";
import type { Product } from "@/types";
import { facetText } from "@/data/mock/taxonomy";
import { useT } from "@/i18n/useT";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-cream-200 py-5 first:pt-0 last:border-0">
      <h2 className="text-[15px] font-medium tracking-tight">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Chips({ values }: { values: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {values.map((value) => (
        <li key={value} className="rounded-full bg-cream-100 px-3 py-1.5 text-[13px]">
          {value}
        </li>
      ))}
    </ul>
  );
}

/** Renders only the attribute sections that the product actually has data for. */
export function ProductAttributes({ product }: { product: Product }) {
  const { m, lang } = useT();
  const label = (key: Parameters<typeof facetText>[0], value: string) =>
    facetText(key, lang).labels[value] ?? value;
  const benefits = product.benefits.map((b) => label("benefits", b));
  const skinTypes = product.skinTypes.map((s) => label("skinTypes", s));
  const concerns = product.concerns.map((c) => label("concerns", c));
  const formulation = product.formulation ? label("formulations", product.formulation) : undefined;
  const howToUse = product.howToUse?.trim();

  const sections = [
    benefits.length > 0 && (
      <Section key="benefits" title={m.product.benefits}>
        <Chips values={benefits} />
      </Section>
    ),
    skinTypes.length > 0 && (
      <Section key="skin" title={m.product.suitableFor}>
        <Chips values={skinTypes} />
      </Section>
    ),
    concerns.length > 0 && (
      <Section key="concerns" title={m.product.targets}>
        <Chips values={concerns} />
      </Section>
    ),
    formulation && (
      <Section key="formulation" title={m.product.formulation}>
        <p className="text-[15px] text-cocoa-800">{formulation}</p>
      </Section>
    ),
    product.keyIngredients.length > 0 && (
      <Section key="ingredients" title={m.product.keyIngredients}>
        <Chips values={product.keyIngredients} />
      </Section>
    ),
    howToUse && (
      <Section key="how" title={m.product.howToUse}>
        <p className="text-[15px] leading-relaxed text-cocoa-800">{howToUse}</p>
      </Section>
    ),
  ].filter(Boolean);

  if (sections.length === 0) return null;

  return <div className="mt-10 border-t border-cream-200 pt-8">{sections}</div>;
}
