import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { PageTransition } from "@/components/page-transition";
import { SiteChrome } from "@/components/site-chrome";
import { StoreProvider } from "@/components/store-provider";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });
const barlow = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: { default: "RIDEFORM — Premium Motorcycle Helmets", template: "%s | RIDEFORM" },
  description:
    "Premium motorcycle helmets engineered for protection and designed for uncompromising performance.",
  keywords: ["motorcycle helmets", "full face helmets", "modular helmets", "premium riding gear"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${barlow.variable}`} suppressHydrationWarning>
      <body
        className="font-[family-name:var(--font-body)] antialiased"
        suppressHydrationWarning
      >
        <StoreProvider>
          <SiteChrome>
            <PageTransition>{children}</PageTransition>
          </SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
