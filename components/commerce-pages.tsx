"use client";

import { Check, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "./product-card";
import { useStore } from "./store-provider";

export function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, notify } = useStore();
  const remaining = Math.max(0, 12450 - cartTotal);
  const checkout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    notify("Checkout details validated — demo order ready");
  };
  return (
    <main className="page-shell min-h-[70vh] py-12 md:py-20">
      <p className="eyebrow mb-3">Secure checkout</p>
      <h1 className="display-title">Your Cart</h1>
      {!cart.length ? (
        <EmptyState
          icon={<ShoppingBag size={38} />}
          title="Your cart is empty"
          copy="Find the protection built for your next ride."
        />
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <section>
            <div className="mb-6 border border-[var(--line)] bg-[var(--surface)] p-4">
              <div className="mb-2 flex justify-between text-xs">
                <span>
                  {remaining > 0
                    ? `Add ₹${remaining.toFixed(0)} for free shipping`
                    : "You unlocked free shipping"}
                </span>
                <TruckCheck />
              </div>
              <div className="h-1.5 bg-[var(--soft)]">
                <div
                  className="h-full bg-[var(--orange)] transition-all"
                  style={{ width: `${Math.min(100, (cartTotal / 12450) * 100)}%` }}
                />
              </div>
            </div>
            {cart.map((item) => {
              const product = products.find((entry) => entry.id === item.productId)!;
              return (
                <article
                  className="flex gap-4 border-b border-[var(--line)] py-5 sm:gap-6"
                  key={`${item.productId}-${item.size}-${item.color}`}
                >
                  <Link
                    className="relative h-32 w-28 shrink-0 overflow-hidden bg-[var(--soft)] sm:h-40 sm:w-36"
                    href={`/products/${product.slug}`}
                  >
                    <Image
                      alt={product.name}
                      className="object-cover"
                      fill
                      sizes="144px"
                      src={product.image}
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="eyebrow">{product.brand}</p>
                        <Link
                          className="mt-1 block text-lg font-bold hover:text-[var(--orange)]"
                          href={`/products/${product.slug}`}
                        >
                          {product.name}
                        </Link>
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          {item.color} · Size {item.size}
                        </p>
                      </div>
                      <button
                        aria-label={`Remove ${product.name}`}
                        className="self-start text-[var(--muted)] hover:text-[var(--orange)]"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-[var(--line)]">
                        <button
                          aria-label="Decrease quantity"
                          className="p-2.5"
                          onClick={() => updateQuantity(product.id, item.quantity - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          aria-label="Increase quantity"
                          className="p-2.5"
                          onClick={() => updateQuantity(product.id, item.quantity + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="font-black">₹{(product.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
          <aside className="h-fit border border-[var(--line)] bg-[var(--surface)] p-6 lg:sticky lg:top-32">
            <h2 className="text-xl font-black uppercase">Order Summary</h2>
            <div className="mt-6 space-y-3 border-b border-[var(--line)] pb-5 text-sm">
              <div className="flex justify-between text-[var(--muted)]">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Shipping</span>
                <span>{cartTotal >= 12450 ? "Free" : "₹999"}</span>
              </div>
              <div className="flex justify-between text-[var(--muted)]">
                <span>Estimated tax</span>
                <span>₹{(cartTotal * 0.18).toFixed(0)}</span>
              </div>
            </div>
            <div className="flex justify-between py-5 text-lg font-black">
              <span>Total</span>
              <span>
                ₹{(cartTotal + (cartTotal >= 12450 ? 0 : 999) + cartTotal * 0.18).toFixed(0)}
              </span>
            </div>
            <form onSubmit={checkout}>
              <label className="sr-only" htmlFor="checkout-email">
                Email for checkout
              </label>
              <input
                className="mb-3 h-12 w-full border border-[var(--line)] bg-transparent px-4 text-sm outline-none focus:border-[var(--orange)]"
                id="checkout-email"
                placeholder="Email for checkout"
                required
                type="email"
              />
              <button className="button-primary w-full" type="submit">
                Secure checkout
              </button>
            </form>
            <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[var(--muted)]">
              <ShieldCheck size={14} /> Encrypted and secure checkout
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}

export function WishlistPage() {
  const { wishlist, recent } = useStore();
  const saved = products.filter((product) => wishlist.includes(product.id));
  const viewed = products.filter((product) => recent.includes(product.id));
  return (
    <main className="page-shell min-h-[70vh] py-12 md:py-20">
      <p className="eyebrow mb-3">Saved for later</p>
      <h1 className="display-title">Wishlist</h1>
      {!saved.length ? (
        <EmptyState
          icon={<Heart size={38} />}
          title="No saved helmets yet"
          copy="Tap the heart on any helmet to save it here."
        />
      ) : (
        <div className="product-grid mt-12">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {viewed.length > 0 && (
        <section className="mt-24 border-t border-[var(--line)] pt-14">
          <p className="eyebrow mb-3">Pick up where you left off</p>
          <h2 className="section-title">Recently Viewed</h2>
          <div className="product-grid mt-10">
            {viewed.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export function ComparePage() {
  const { compare, toggleCompare } = useStore();
  const compared = products.filter((product) => compare.includes(product.id));
  return (
    <main className="page-shell min-h-[70vh] py-12 md:py-20">
      <p className="eyebrow mb-3">Side by side</p>
      <h1 className="display-title">Compare</h1>
      {!compared.length ? (
        <EmptyState
          icon={<Check size={38} />}
          title="Nothing to compare"
          copy="Use the compare icon on product cards to add up to three helmets."
        />
      ) : (
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-40 border-b border-[var(--line)] p-4 text-xs uppercase text-[var(--muted)]">
                  Product
                </th>
                {compared.map((product) => (
                  <th className="border-b border-[var(--line)] p-4 align-top" key={product.id}>
                    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--soft)]">
                      <Image
                        alt={product.name}
                        className="object-cover"
                        fill
                        sizes="260px"
                        src={product.image}
                      />
                      <button
                        aria-label={`Remove ${product.name}`}
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-black"
                        onClick={() => toggleCompare(product.id)}
                      >
                        <X size={15} />
                      </button>
                    </div>
                    <Link
                      className="mt-4 block text-lg font-bold hover:text-[var(--orange)]"
                      href={`/products/${product.slug}`}
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-lg font-black">₹{product.price.toLocaleString("en-IN")}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Type", (id: number) => products.find((p) => p.id === id)!.type],
                ["Rating", (id: number) => `${products.find((p) => p.id === id)!.rating} / 5`],
                ["Shell", (id: number) => products.find((p) => p.id === id)!.specs.Shell],
                ["Weight", (id: number) => products.find((p) => p.id === id)!.specs.Weight],
                ["Sizes", (id: number) => products.find((p) => p.id === id)!.sizes.join(", ")],
                [
                  "Certification",
                  (id: number) => products.find((p) => p.id === id)!.certifications[0],
                ],
              ].map(([label, getter]) => (
                <tr key={label as string}>
                  <th className="border-b border-[var(--line)] p-4 text-xs uppercase text-[var(--muted)]">
                    {label as string}
                  </th>
                  {compared.map((product) => (
                    <td
                      className="border-b border-[var(--line)] p-4 text-sm font-semibold"
                      key={product.id}
                    >
                      {(getter as (id: number) => string)(product.id)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export function AccountPage() {
  const { notify } = useStore();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    notify("Demo sign-in complete");
  };
  return (
    <main className="page-shell grid min-h-[70vh] place-items-center py-16">
      <div className="w-full max-w-md border border-[var(--line)] bg-[var(--surface)] p-7 sm:p-10">
        <p className="eyebrow mb-3">Rider account</p>
        <h1 className="text-4xl font-black uppercase">Welcome back.</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Track orders, save your fit and access member offers.
        </p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <label className="block text-xs font-bold uppercase tracking-wider">
            Email
            <input
              className="mt-2 h-12 w-full border border-[var(--line)] bg-transparent px-4 text-sm font-normal outline-none focus:border-[var(--orange)]"
              required
              type="email"
            />
          </label>
          <label className="block text-xs font-bold uppercase tracking-wider">
            Password
            <input
              className="mt-2 h-12 w-full border border-[var(--line)] bg-transparent px-4 text-sm font-normal outline-none focus:border-[var(--orange)]"
              minLength={6}
              required
              type="password"
            />
          </label>
          <button className="button-primary w-full" type="submit">
            Sign in
          </button>
        </form>
        <button
          className="mt-5 w-full text-center text-xs text-[var(--muted)] underline underline-offset-4"
          onClick={() => notify("Password reset link requested")}
        >
          Forgot password?
        </button>
      </div>
    </main>
  );
}

function EmptyState({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <div className="mt-12 grid min-h-[420px] place-items-center border border-[var(--line)] bg-[var(--surface)] text-center">
      <div>
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--soft)] text-[var(--orange)]">
          {icon}
        </span>
        <h2 className="mt-5 text-2xl font-black">{title}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{copy}</p>
        <Link className="button-primary mt-6" href="/collections">
          Shop helmets
        </Link>
      </div>
    </div>
  );
}

function TruckCheck() {
  return (
    <span className="flex items-center gap-1 font-bold text-[var(--orange)]">
      <Check size={13} /> Free over ₹12,450
    </span>
  );
}
