"use client";

import {
  BadgeCheck,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { discount, products } from "@/lib/products";
import { ProductRail } from "./product-card";
import { useStore } from "./store-provider";

const colorMap: Record<string, string> = {
  Black: "#171918",
  White: "#eee",
  Red: "#d32e2e",
  Blue: "#2556a7",
  Orange: "#ff4d00",
  Yellow: "#efc526",
};

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, addRecent, toggleWishlist, wishlist, notify } = useStore();
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const saved = wishlist.includes(product.id);

  useEffect(() => addRecent(product.id), [product.id]);

  const checkDelivery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    notify("Delivery available in 2–3 business days");
  };

  return (
    <main>
      <section className="page-shell py-8 md:py-14">
        <p className="mb-7 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
          Home / Helmets / {product.type} /{" "}
          <span className="text-[var(--text)]">{product.name}</span>
        </p>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div className="grid gap-3 sm:grid-cols-[84px_minmax(0,1fr)]">
            <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
              {product.images.map((source, index) => (
                <button
                  aria-label={`View product image ${index + 1}`}
                  className={`relative aspect-square w-20 overflow-hidden border-2 bg-[var(--soft)] ${imageIndex === index ? "border-[var(--orange)]" : "border-transparent"}`}
                  key={source}
                  onClick={() => setImageIndex(index)}
                >
                  <Image alt="" className="object-cover" fill sizes="80px" src={source} />
                </button>
              ))}
            </div>
            <button
              aria-label={zoomed ? "Zoom out product image" : "Zoom in product image"}
              className="relative order-1 aspect-[4/4.6] overflow-hidden bg-[var(--soft)] sm:order-2"
              onClick={() => setZoomed(!zoomed)}
            >
              <Image
                alt={`${product.name} motorcycle helmet`}
                className={`object-cover transition duration-700 ${zoomed ? "scale-150" : "scale-100"}`}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 55vw"
                src={product.images[imageIndex]}
              />
              <span className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white">
                Click to {zoomed ? "reset" : "zoom"}
              </span>
            </button>
          </div>

          <div className="lg:py-4">
            <div className="flex items-center justify-between">
              <p className="eyebrow">
                {product.brand} · {product.type}
              </p>
              {product.badge && (
                <span className="bg-[var(--orange)] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                  {product.badge}
                </span>
              )}
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[clamp(2.4rem,8vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.035em]">
              {product.name}
            </h1>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex text-[var(--orange)]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    className={index < Math.round(product.rating) ? "fill-current" : ""}
                    key={index}
                    size={14}
                  />
                ))}
              </span>
              <button
                className="text-xs text-[var(--muted)] underline underline-offset-4"
                onClick={() => document.getElementById("reviews")?.scrollIntoView()}
              >
                {product.rating} · {product.reviews} reviews
              </button>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-black">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[var(--muted)] line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-[var(--orange)]/10 px-2 py-1 text-xs font-extrabold text-[var(--orange)]">
                    SAVE {discount(product)}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-6 text-sm leading-7 text-[var(--muted)]">{product.description}</p>

            <fieldset className="mt-8">
              <div className="mb-3 flex justify-between">
                <legend className="text-xs font-extrabold uppercase tracking-wider">
                  Select size
                </legend>
                <button
                  className="text-[10px] font-bold uppercase text-[var(--muted)] underline underline-offset-4"
                  onClick={() => notify("Size guide: S 55–56 · M 57–58 · L 59–60 · XL 61–62 cm")}
                >
                  Size guide
                </button>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((value) => (
                  <button
                    className={`grid h-12 min-w-12 place-items-center border text-xs font-bold transition ${size === value ? "border-[var(--orange)] bg-[var(--orange)] text-white" : "border-[var(--line)] hover:border-[var(--text)]"}`}
                    key={value}
                    onClick={() => setSize(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-7">
              <legend className="mb-3 text-xs font-extrabold uppercase tracking-wider">
                Color: <span className="text-[var(--muted)]">{color}</span>
              </legend>
              <div className="flex gap-3">
                {product.colors.map((value) => (
                  <button
                    aria-label={`Select ${value}`}
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 ${color === value ? "border-[var(--orange)]" : "border-transparent"}`}
                    key={value}
                    onClick={() => setColor(value)}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-black/10"
                      style={{ backgroundColor: colorMap[value] }}
                    />
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 flex gap-3">
              <div className="flex h-[54px] items-center border border-[var(--line)]">
                <button
                  aria-label="Decrease quantity"
                  className="h-full px-3"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={15} />
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  aria-label="Increase quantity"
                  className="h-full px-3"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus size={15} />
                </button>
              </div>
              <button
                className="button-primary flex-1"
                onClick={() => addToCart(product, { size, color, quantity })}
              >
                <ShoppingBag size={17} /> Add to cart
              </button>
              <button
                aria-label={`${saved ? "Remove from" : "Add to"} wishlist`}
                className={`icon-button h-[54px] w-[54px] ${saved ? "bg-[var(--orange)] text-white" : ""}`}
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={saved ? "fill-current" : ""} size={19} />
              </button>
            </div>
            <button
              className="button-secondary mt-3 w-full"
              onClick={() => {
                addToCart(product, { size, color, quantity });
                notify("Ready for secure checkout");
              }}
            >
              <span>Buy now</span>
              <Zap size={16} />
            </button>

            <div className="mt-7 grid grid-cols-3 gap-px bg-[var(--line)]">
              {[
                [ShieldCheck, "Certified"],
                [Truck, "Free delivery"],
                [BadgeCheck, "5-year warranty"],
              ].map(([Icon, label]) => (
                <div
                  className="flex flex-col items-center gap-2 bg-[var(--background)] p-4 text-center text-[9px] font-bold uppercase tracking-wider"
                  key={label as string}
                >
                  <Icon className="text-[var(--orange)]" size={19} />
                  {label as string}
                </div>
              ))}
            </div>
            <form className="mt-7 flex border-b border-[var(--line)]" onSubmit={checkDelivery}>
              <label className="sr-only" htmlFor="postal-code">
                Postal code
              </label>
              <input
                className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
                id="postal-code"
                placeholder="Enter postal code for delivery"
                required
              />
              <button
                className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--orange)]"
                type="submit"
              >
                Check availability
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)]">
        <div className="page-shell grid gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="eyebrow mb-3">Technical details</p>
            <h2 className="section-title">Made to perform.</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--muted)]">
              {product.description} Every contact point is refined for lasting comfort, from the
              moisture-wicking liner to the emergency-release cheek pads.
            </p>
          </div>
          <div>
            {Object.entries(product.specs).map(([label, value]) => (
              <div
                className="flex justify-between gap-5 border-b border-[var(--line)] py-4 text-sm"
                key={label}
              >
                <span className="text-[var(--muted)]">{label}</span>
                <strong className="text-right">{value}</strong>
              </div>
            ))}
            <div className="mt-6 flex flex-wrap gap-2">
              {product.certifications.map((item) => (
                <span
                  className="flex items-center gap-2 border border-[var(--line)] px-3 py-2 text-[10px] font-bold uppercase tracking-wider"
                  key={item}
                >
                  <Check className="text-[var(--orange)]" size={13} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 md:py-24" id="reviews">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow mb-3">Verified owners</p>
            <h2 className="section-title">Rider reviews.</h2>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-6xl font-black">{product.rating}</span>
              <div className="pb-1">
                <div className="flex text-[var(--orange)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star className="fill-current" key={i} size={16} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Based on {product.reviews} reviews
                </p>
              </div>
            </div>
          </div>
          <div>
            {[
              [
                "Excellent fit and remarkably quiet at highway speed.",
                "Alex M.",
                "Size M · Verified buyer",
              ],
              [
                "Feels light, planted and exceptionally well finished.",
                "Jordan P.",
                "Size L · Verified buyer",
              ],
            ].map(([review, name, meta]) => (
              <article className="border-b border-[var(--line)] py-6 first:pt-0" key={name}>
                <div className="flex text-[var(--orange)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star className="fill-current" key={i} size={12} />
                  ))}
                </div>
                <p className="mt-4 font-semibold">“{review}”</p>
                <p className="mt-3 text-xs">
                  <strong>{name}</strong>
                  <span className="ml-2 text-[var(--muted)]">{meta}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ProductRail
        eyebrow="Complete your kit"
        products={products.filter((entry) => entry.id !== product.id).slice(0, 4)}
        title="Related Helmets"
      />
    </main>
  );
}
