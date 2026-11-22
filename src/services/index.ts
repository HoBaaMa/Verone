import type {
  ArticleService,
  AuthService,
  CategoryService,
  ContentService,
  PressService,
  OrderService,
  ProductService,
} from "./contracts";
import { mockArticleService } from "./mock/mockArticleService";
import { mockAuthService } from "./mock/mockAuthService";
import { mockCategoryService } from "./mock/mockCategoryService";
import { mockContentService } from "./mock/mockContentService";
import { mockOrderService } from "./mock/mockOrderService";
import { mockPressService } from "./mock/mockPressService";
import { mockProductService } from "./mock/mockProductService";

/**
 * Composition root for data access. To connect the ASP.NET Core API, add
 * `services/http/*` implementations of the same contracts and export them here.
 */
export const productService: ProductService = mockProductService;
export const categoryService: CategoryService = mockCategoryService;
export const articleService: ArticleService = mockArticleService;
export const pressService: PressService = mockPressService;
export const contentService: ContentService = mockContentService;
export const authService: AuthService = mockAuthService;
export const orderService: OrderService = mockOrderService;

export type {
  ArticleService,
  AuthService,
  CategoryService,
  ContentService,
  OrderService,
  PressService,
  ProductService,
} from "./contracts";
