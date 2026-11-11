"use client";

import {
  ChevronDown,
  CircleUserRound,
  GitCompareArrows,
  Heart,
  Home,
  Menu,
  MessageCircle,
  Moon,
  Search,
  ShoppingBag,
  Store,
  Sun,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { products } from "@/lib/products";
import { useStore } from "./store-provider";

const nav = [
  { label: "Home", href: "/" },
  {
    label: "Helmets",
    href: "/collections",
    children: [
      ["All Helmets", "/collections"],
      ["Full Face", "/collections?type=Full+Face"],
      ["Modular", "/collections?type=Modular"],
      ["Open Face", "/collections?type=Open+Face"],
      ["Off Road", "/collections?type=Off+Road"],
    ],
  },
  { label: "Full Face", href: "/collections?type=Full+Face" },
  { label: "Modular", href: "/collections?type=Modular" },
  { label: "Open Face", href: "/collections?type=Open+Face" },
  {
    label: "Accessories",
    href: "/collections",
    children: [
      ["Visors & shields", "/collections"],
      ["Helmet care", "/collections"],
      ["Bluetooth comms", "/collections"],
      ["Replacement parts", "/collections"],
    ],
  },
  { label: "Offers", href: "/collections?offer=true", accent: true },
  { label: "About Us", href: "/#why" },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const { cartCount, wishlist, compare, setCartOpen, theme, toggleTheme } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const suggestions = query.trim()
    ? products
        .filter((product) =>
          `${product.name} ${product.brand} ${product.type}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  return (
    <>
      <div className="bg-[var(--orange)] px-4 py-2 text-center text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
        Free shipping over ₹12,450 <span className="mx-3 opacity-50">|</span> 30-day easy returns
      </div>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111312]/95 text-white backdrop-blur-xl">
        <div className="page-shell flex h-[74px] items-center gap-5">
          <button
            aria-label="Open navigation"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={23} />
          </button>
          <Logo />
          <nav className="ml-auto hidden h-full items-center xl:flex">
            {nav.map((item) => (
              <div className="group relative flex h-full items-center" key={item.label}>
                <Link
                  className={`flex h-full items-center gap-1 px-3 text-[11px] font-bold uppercase tracking-[0.08em] transition hover:text-[var(--orange)] ${item.accent ? "text-[var(--orange)]" : "text-white/75"}`}
                  href={item.href}
                >
                  {item.label}
                  {item.children && <ChevronDown size={13} />}
                </Link>
                {item.children && (
                  <div className="pointer-events-none absolute left-0 top-[66px] w-56 translate-y-2 border border-black/10 bg-[#f7f6f2] p-2 text-[#151716] opacity-0 shadow-2xl transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map(([label, href]) => (
                      <Link
                        className="block px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#e9e8e4] hover:text-[var(--orange)]"
                        href={href}
                        key={label}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 xl:ml-4">
            <button
              aria-label="Search"
              className="icon-button border-white/15"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={18} />
            </button>
            <button
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              className="icon-button hidden border-white/15 sm:grid"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link
              aria-label={`Wishlist with ${wishlist.length} items`}
              className="icon-button relative hidden border-white/15 sm:grid"
              href="/wishlist"
            >
              <Heart size={18} />
              {wishlist.length > 0 && <Count value={wishlist.length} />}
            </Link>
            <Link
              aria-label={`Compare ${compare.length} items`}
              className="icon-button relative hidden border-white/15 md:grid"
              href="/compare"
            >
              <GitCompareArrows size={18} />
              {compare.length > 0 && <Count value={compare.length} />}
            </Link>
            <Link
              aria-label="Account"
              className="icon-button hidden border-white/15 md:grid"
              href="/account"
            >
              <CircleUserRound size={18} />
            </Link>
            <button
              aria-label={`Cart with ${cartCount} items`}
              className="icon-button relative border-white/15"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <Count value={cartCount} />}
            </button>
          </div>
        </div>
      </header>

      {children}

      <Footer />
      <Link
        aria-label="Chat with support"
        className="fixed bottom-20 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#24d366] text-white shadow-xl transition hover:scale-110 md:bottom-6 md:right-6"
        href="https://wa.me/18007433367"
      >
        <MessageCircle size={22} />
      </Link>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[var(--line)] bg-[var(--surface)]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg md:hidden">
        {[
          ["Home", "/", Home, 0],
          ["Shop", "/collections", Store, 0],
          ["Wishlist", "/wishlist", Heart, wishlist.length],
          ["Cart", "/cart", ShoppingBag, cartCount],
        ].map(([label, href, Icon, count]) => (
          <Link
            className={`relative flex flex-col items-center gap-1 py-1 text-[9px] font-bold uppercase tracking-wider ${pathname === href ? "text-[var(--orange)]" : "text-[var(--muted)]"}`}
            href={href as string}
            key={label as string}
          >
            <Icon size={20} />
            {(count as number) > 0 && (
              <span className="absolute right-[calc(50%-18px)] top-0 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-[var(--orange)] px-1 text-[8px] font-extrabold text-white">
                {count as number}
              </span>
            )}
            <span>{label as string}</span>
          </Link>
        ))}
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[65] lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(90vw,390px)] overflow-y-auto bg-[#111312] p-6 text-white">
            <div className="mb-8 flex items-center justify-between">
              <Logo />
              <button aria-label="Close navigation" onClick={() => setMenuOpen(false)}>
                <X />
              </button>
            </div>
            {nav.map((item) =>
              item.children ? (
                <details className="border-b border-white/10" key={item.label}>
                  <summary className="flex list-none items-center justify-between py-4 text-sm font-bold uppercase tracking-wider">
                    {item.label}
                    <ChevronDown size={16} />
                  </summary>
                  <div className="grid gap-3 pb-5 pl-4 text-sm text-white/55">
                    {item.children.map(([label, href]) => (
                      <Link href={href} key={label} onClick={() => setMenuOpen(false)}>
                        {label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  className={`block border-b border-white/10 py-4 text-sm font-bold uppercase tracking-wider ${item.accent ? "text-[var(--orange)]" : ""}`}
                  href={item.href}
                  key={item.label}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
            <button
              className="mt-6 flex items-center gap-3 text-sm text-white/60"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} Switch theme
            </button>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[75] bg-[#111312]/98 px-5 text-white">
          <div className="mx-auto max-w-3xl pt-[15vh]">
            <div className="flex items-center border-b border-white/30">
              <Search className="text-[var(--orange)]" size={24} />
              <input
                autoFocus
                className="h-20 min-w-0 flex-1 bg-transparent px-5 text-xl font-semibold outline-none placeholder:text-white/30 sm:text-3xl"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search helmets, brands, styles..."
                value={query}
              />
              <button
                aria-label="Close search"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
              >
                <X size={26} />
              </button>
            </div>
            <div className="mt-6">
              {query && !suggestions.length && (
                <p className="py-8 text-center text-white/50">No helmets match “{query}”</p>
              )}
              {suggestions.map((product) => (
                <Link
                  className="flex items-center gap-4 border-b border-white/10 py-4 transition hover:border-[var(--orange)]"
                  href={`/products/${product.slug}`}
                  key={product.id}
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="relative h-16 w-16 overflow-hidden bg-white/10">
                    <Image alt="" className="object-cover" fill sizes="64px" src={product.image} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/45">
                      {product.brand} · {product.type}
                    </p>
                    <p className="font-bold">{product.name}</p>
                  </div>
                  <span className="ml-auto font-bold">₹{product.price.toLocaleString("en-IN")}</span>
                </Link>
              ))}
              {!query && (
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                  Popular: Carbon · Full Face · Modular · Apex
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Count({ value }: { value: number }) {
  return (
    <span className="absolute -right-1 -top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[var(--orange)] px-1 text-[9px] font-extrabold text-white">
      {value}
    </span>
  );
}

function Logo() {
  return (
    <Link className="flex shrink-0 items-center gap-2" href="/">
      <span className="relative grid h-8 w-8 place-items-center overflow-hidden bg-[var(--orange)] before:absolute before:h-10 before:w-2 before:-rotate-45 before:bg-[#111312]">
        <span className="relative h-2 w-2 rounded-full bg-white" />
      </span>
      <span className="font-[family-name:var(--font-display)] text-2xl font-black tracking-[-0.03em]">
        RIDEFORM
      </span>
    </Link>
  );
}

function Footer() {
  const { notify } = useStore();
  return (
    <footer className="border-t border-white/10 bg-[#0c0e0d] pb-20 text-white md:pb-0">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-20">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-6 text-sm leading-7 text-white/45">
            Precision-built protection for riders who refuse to compromise. Ride further. Ride
            safer. Rideform.
          </p>
        </div>
        {[
          ["Shop", ["Full Face", "Modular", "Open Face", "Off Road"]],
          ["Support", ["Size Guide", "Delivery", "Returns", "Contact"]],
          ["Company", ["Our Story", "Safety", "Journal", "Careers"]],
        ].map(([title, links]) => (
          <div key={title as string}>
            <p className="text-xs font-bold uppercase tracking-[0.16em]">{title as string}</p>
            <div className="mt-5 grid gap-3 text-sm text-white/45">
              {(links as string[]).map((link) => (
                <Link
                  href={link === "Our Story" ? "/#why" : "/collections"}
                  key={link}
                  className="hover:text-[var(--orange)]"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="page-shell flex flex-col gap-4 border-t border-white/10 py-6 text-[10px] uppercase tracking-wider text-white/35 sm:flex-row sm:justify-between">
        <p>© 2026 Rideform. All rights reserved.</p>
        <button onClick={() => notify("Privacy preferences saved")}>
          Privacy · Terms · Accessibility
        </button>
      </div>
    </footer>
  );
}
