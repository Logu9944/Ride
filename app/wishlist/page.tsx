import type { Metadata } from "next";
import { WishlistPage } from "@/components/commerce-pages";

export const metadata: Metadata = { title: "Wishlist" };
export default function Page() {
  return <WishlistPage />;
}
