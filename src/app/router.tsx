import { createBrowserRouter, type RouteObject } from "react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import CategoryPage from "@/pages/CategoryPage";
import CartPage from "@/pages/CartPage";
import ProductPage from "@/pages/ProductPage";
import WishlistPage from "@/pages/WishlistPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { PlannedPage } from "@/pages/PlannedPage";

/** Every page, mounted at `/` (English) and `/ar` (Arabic). */
const routes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: "shop", element: <ShopPage /> },
  { path: "shop/:category", element: <CategoryPage /> },
  { path: "product/:slug", element: <ProductPage /> },
  { path: "cart", element: <CartPage /> },
  { path: "checkout", element: <CheckoutPage /> },
  { path: "checkout/confirmation/:orderNumber", element: <OrderConfirmationPage /> },
  { path: "wishlist", element: <WishlistPage /> },
  {
    path: "account",
    element: <PlannedPage page="account" />,
  },
  {
    path: "journal",
    element: <PlannedPage page="journal" />,
  },
  {
    path: "journal/:slug",
    element: <PlannedPage page="article" />,
  },
  {
    path: "about",
    element: <PlannedPage page="about" />,
  },
  { path: "*", element: <NotFoundPage /> },
];

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [...routes, { path: "ar", children: routes }],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" },
);
