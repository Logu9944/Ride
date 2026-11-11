import type { Metadata } from "next";
import { CartPage } from "@/components/commerce-pages";

export const metadata: Metadata = { title: "Shopping Cart" };
export default function Page() {
  return <CartPage />;
}
