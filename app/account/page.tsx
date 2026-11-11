import type { Metadata } from "next";
import { AccountPage } from "@/components/commerce-pages";

export const metadata: Metadata = { title: "Rider Account" };
export default function Page() {
  return <AccountPage />;
}
