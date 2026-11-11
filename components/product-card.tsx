"use client";

import { Eye, GitCompareArrows, Heart, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { discount, type Product } from "@/lib/products";
import { useStore } from "./store-provider";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, compare, toggleWishlist, toggleCompare, setQuickView } = useStore();
  const saved = wishlist.includes(product.id);
  const compared = compare.includes(product.id);
  const [tapped, setTapped] = useState(false);

  return (
    <article className="group min-w-0">
      <div
        className="relative aspect-[4/4.7] overflow-hidden bg-[var(--soft)]"
        onClick={() => setTapped((v) => !v)}
      >
        <Link
          href={`/products/${product.slug}`}
          onClick={(e) => { if (!tapped) e.preventDefault(); }}
        >
          <Image
            alt={`${product.name} ${product.type} motorcycle helmet`}
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
            fill
            sizes="(max-width: 700px) 50vw, (max-width: 1200px) 33vw, 25vw"
            src={product.image}
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span className="bg-[#151716] px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white">
              {product.badge}
            </span>
          )}
          {discount(product) > 0 && (
            <span className="bg-[var(--orange)] px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white">
              -{discount(product)}%
            </span>
          )}
        </div>
        <button
          aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-[#151716] shadow-sm transition hover:text-[var(--orange)] ${saved ? "text-[var(--orange)]" : ""}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
        >
          <Heart className={saved ? "fill-current" : ""} size={17} />
        </button>
        <div
          className={`absolute inset-x-3 bottom-3 flex gap-2 transition duration-300 ${
            tapped ? "translate-y-0" : "translate-y-16"
          } sm:translate-y-16 sm:group-hover:translate-y-0 sm:focus-within:translate-y-0`}
        >
          <button
            className="flex h-12 flex-1 items-center justify-center gap-2 bg-[var(--orange)] text-[10px] font-extrabold uppercase tracking-wider text-white transition hover:bg-[#ff6a29] touch-manipulation"
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          >
            <ShoppingBag size={15} />
            Add to cart
          </button>
          <button
            aria-label={`Quick view ${product.name}`}
            className="hidden sm:grid h-12 w-12 place-items-center bg-white text-[#151716] transition hover:text-[var(--orange)]"
            onClick={(e) => { e.stopPropagation(); setQuickView(product); }}
          >
            <Eye size={17} />
          </button>
        </div>
      </div>
      <div className="pt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[var(--orange)]">
            {product.brand} · {product.type}
          </p>
          <button
            aria-label={`${compared ? "Remove from" : "Add to"} comparison`}
            className={`transition hover:text-[var(--orange)] ${compared ? "text-[var(--orange)]" : "text-[var(--muted)]"}`}
            onClick={() => toggleCompare(product.id)}
          >
            <GitCompareArrows size={15} />
          </button>
        </div>
        <div className="flex items-start justify-between gap-3">
          <Link
            className="font-bold leading-tight transition hover:text-[var(--orange)]"
            href={`/products/${product.slug}`}
          >
            {product.name}
          </Link>
          <div className="shrink-0 text-right text-sm">
            <span className="font-extrabold">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <span className="ml-1.5 text-[11px] text-[var(--muted)] line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="flex text-[var(--orange)]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                className={index < Math.round(product.rating) ? "fill-current" : ""}
                key={index}
                size={11}
              />
            ))}
          </span>
          <span className="text-[10px] text-[var(--muted)]">
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">
          <span>{product.sizes.join("  /  ")}</span>
          <span>{product.colors.length} colors</span>
        </div>
      </div>
    </article>
  );
}

export function ProductRail({
  products,
  title,
  eyebrow,
  href = "/collections",
}: {
  products: Product[];
  title: string;
  eyebrow: string;
  href?: string;
}) {
  return (
    <section className="page-shell py-16 md:py-24">
      <div className="mb-9 flex items-end justify-between gap-5 md:mb-12">
        <div>
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="section-title">{title}</h2>
        </div>
        <Link
          className="hidden border-b border-[var(--text)] pb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] transition hover:border-[var(--orange)] hover:text-[var(--orange)] sm:block"
          href={href}
        >
          View all
        </Link>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
