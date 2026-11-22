import type { Article } from "@/types";
import { unsplash } from "./images";

export const articles: Article[] = [
  {
    id: "a-001",
    slug: "why-your-skin-barrier-matters",
    title: "Why Your Skin Barrier Matters",
    excerpt:
      "Learn how a healthy skin barrier protects against dryness, irritation, and environmental stress.",
    coverImage: unsplash("1646457417455-77a66a9fcf34", 1200),
    topic: "Skin science",
    author: { name: "Dr. Elise Marchand", role: "Consulting dermatologist" },
    publishedAt: "2026-02-12",
    readingMinutes: 6,
    body: [
      {
        type: "paragraph",
        text: "Your skin barrier is the outermost layer of your skin — a tightly organised wall of cells and lipids that keeps moisture in and irritants out.",
      },
      { type: "heading", text: "Signs of a compromised barrier" },
      {
        type: "paragraph",
        text: "Tightness after cleansing, sudden sensitivity and flaking are common signals that your barrier needs support.",
      },
      {
        type: "quote",
        text: "Healthy skin is rarely about adding more. It is about protecting what is already there.",
      },
    ],
    relatedProductSlugs: ["soralone-urea-shower-gel", "soralone-urea-hand-cream"],
  },
  {
    id: "a-002",
    slug: "morning-routine-for-glowing-skin",
    title: "Morning Routine for Glowing Skin",
    excerpt: "Build a simple skincare routine that keeps your skin hydrated throughout the day.",
    coverImage: unsplash("1597826322461-9b11d306d08f", 1200),
    topic: "Routines",
    author: { name: "Camille Rousseau", role: "Head of formulation" },
    publishedAt: "2026-01-28",
    readingMinutes: 4,
    body: [
      {
        type: "paragraph",
        text: "A great morning routine is short, consistent and built around protection.",
      },
      { type: "heading", text: "Cleanse, treat, protect" },
      {
        type: "paragraph",
        text: "Start with a gentle cleanser, follow with a vitamin C serum and finish with moisturiser and SPF.",
      },
    ],
    relatedProductSlugs: ["bright-glow-deal", "vacation-sunscreen-cream-duo"],
  },
  {
    id: "a-003",
    slug: "choosing-the-right-moisturizer",
    title: "Choosing the Right Moisturizer",
    excerpt: "Find the perfect moisturizer based on your skin type and lifestyle.",
    coverImage: unsplash("1618871588239-18017db1dc15", 1200),
    topic: "Guides",
    author: { name: "Dr. Elise Marchand", role: "Consulting dermatologist" },
    publishedAt: "2026-01-09",
    readingMinutes: 5,
    body: [
      {
        type: "paragraph",
        text: "The right moisturiser depends on your skin type, climate and the rest of your routine.",
      },
      { type: "heading", text: "Texture is a clue" },
      {
        type: "paragraph",
        text: "Gels suit oily skin, lotions balance combination skin and rich creams comfort dry skin.",
      },
    ],
    relatedProductSlugs: ["soralone-acne-prone-moisturizer", "vacation-watermelon-body-milk"],
  },
  {
    id: "a-004",
    slug: "the-art-of-facial-massage",
    title: "The Art of Facial Massage",
    excerpt:
      "Five minutes a day with a sculpting tool can soften tension and restore a rested look.",
    coverImage: unsplash("1728727267814-792db55ce678", 1200),
    topic: "Rituals",
    author: { name: "Camille Rousseau", role: "Head of formulation" },
    publishedAt: "2025-12-15",
    readingMinutes: 3,
    body: [
      {
        type: "paragraph",
        text: "Facial massage boosts circulation and helps your serum work harder.",
      },
    ],
    relatedProductSlugs: ["youthful-skin-deal", "wrinkless-duo"],
  },
];
