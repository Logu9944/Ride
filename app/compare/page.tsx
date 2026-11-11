import type { Metadata } from "next";
import { ComparePage } from "@/components/commerce-pages";

export const metadata: Metadata = { title: "Compare Helmets" };
export default function Page() {
  return <ComparePage />;
}
