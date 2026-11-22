import type { Lang } from "@/i18n/config";
import type {
  Article,
  Category,
  ConcernTile,
  HeroSlide,
  Order,
  PlaceOrderRequest,
  PagedResult,
  PressMention,
  Product,
  ProductFacets,
  ProductQuery,
  SignInRequest,
  SignUpRequest,
  User,
} from "@/types";

/**
 * Service contracts consumed by hooks and pages. Implementations can be
 * swapped (mock → HTTP) in `services/index.ts` without touching UI code.
 * `lang` maps to the API's `Accept-Language`; content comes back translated.
 */
export interface ProductService {
  getProducts(query?: ProductQuery): Promise<PagedResult<Product>>;
  getProductBySlug(slug: string, lang?: Lang): Promise<Product | null>;
  getFacets(query?: ProductQuery): Promise<ProductFacets>;
  getRelatedProducts(slug: string, limit?: number, lang?: Lang): Promise<Product[]>;
  /** Returns matching products in the order of the given ids; unknown ids are skipped. */
  getProductsByIds(ids: string[], lang?: Lang): Promise<Product[]>;
}

export interface CategoryService {
  getCategories(lang?: Lang): Promise<Category[]>;
  getCategoryBySlug(slug: string, lang?: Lang): Promise<Category | null>;
}

export interface ArticleService {
  getArticles(limit?: number, lang?: Lang): Promise<Article[]>;
  getArticleBySlug(slug: string, lang?: Lang): Promise<Article | null>;
}

export interface PressService {
  getPressMentions(): Promise<PressMention[]>;
}

/** Merchandised marketing content (hero slides, campaigns). */
export interface ContentService {
  getHeroSlides(lang?: Lang): Promise<HeroSlide[]>;
  getConcernTiles(lang?: Lang): Promise<ConcernTile[]>;
}

/**
 * Authentication. Rejects with `AuthError` for expected failures. The HTTP
 * implementation will exchange credentials for a session/token with the API.
 */
export interface AuthService {
  signIn(request: SignInRequest): Promise<User>;
  signUp(request: SignUpRequest): Promise<User>;
  /** Always resolves, so the UI never reveals whether an account exists. */
  requestPasswordReset(identifier: string): Promise<void>;
  signOut(): Promise<void>;
}

/** Order placement. The HTTP implementation will create a payment intent and order server-side. */
export interface OrderService {
  placeOrder(request: PlaceOrderRequest): Promise<Order>;
  getOrder(number: string): Promise<Order | null>;
}
