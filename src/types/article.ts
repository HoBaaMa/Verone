export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string };

export interface Author {
  name: string;
  role: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  topic: string;
  author: Author;
  publishedAt: string;
  readingMinutes: number;
  body: ArticleBlock[];
  relatedProductSlugs: string[];
}
