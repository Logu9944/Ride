"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { products } from "@/lib/products";

export type CartItem = { productId: number; quantity: number; size: string; color: string };

type StoreContextValue = {
  cart: CartItem[];
  wishlist: number[];
  compare: number[];
  recent: number[];
  quickView: Product | null;
  cartOpen: boolean;
  theme: "dark" | "light";
  cartCount: number;
  cartTotal: number;
  addToCart: (
    product: Product,
    options?: { size?: string; color?: string; quantity?: number },
  ) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  toggleWishlist: (id: number) => void;
  toggleCompare: (id: number) => void;
  addRecent: (id: number) => void;
  setQuickView: (product: Product | null) => void;
  setCartOpen: (open: boolean) => void;
  toggleTheme: () => void;
  notify: (message: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function usePersistedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) setValue(JSON.parse(stored) as T);
  }, [key]);
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = usePersistedState<CartItem[]>("rideform-cart", []);
  const [wishlist, setWishlist] = usePersistedState<number[]>("rideform-wishlist", []);
  const [compare, setCompare] = usePersistedState<number[]>("rideform-compare", []);
  const [recent, setRecent] = usePersistedState<number[]>("rideform-recent", []);
  const [theme, setTheme] = usePersistedState<"dark" | "light">("rideform-theme", "dark");
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const addToCart: StoreContextValue["addToCart"] = (product, options = {}) => {
    const size = options.size || product.sizes[0];
    const color = options.color || product.colors[0];
    const quantity = options.quantity || 1;
    setCart((current) => {
      const match = current.find(
        (item) => item.productId === product.id && item.size === size && item.color === color,
      );
      return match
        ? current.map((item) =>
            item === match ? { ...item, quantity: item.quantity + quantity } : item,
          )
        : [...current, { productId: product.id, quantity, size, color }];
    });
    setCartOpen(true);
    notify(`${product.name} added to cart`);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  };
  const removeFromCart = (productId: number) =>
    setCart((current) => current.filter((item) => item.productId !== productId));
  const toggleWishlist = (id: number) => {
    setWishlist((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    notify(wishlist.includes(id) ? "Removed from wishlist" : "Saved to wishlist");
  };
  const toggleCompare = (id: number) => {
    if (!compare.includes(id) && compare.length >= 3) return notify("Compare up to 3 helmets");
    setCompare((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    notify(compare.includes(id) ? "Removed from comparison" : "Added to comparison");
  };
  const addRecent = (id: number) =>
    setRecent((current) => [id, ...current.filter((item) => item !== id)].slice(0, 4));

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      compare,
      recent,
      quickView,
      cartOpen,
      theme,
      cartCount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      toggleWishlist,
      toggleCompare,
      addRecent,
      setQuickView,
      setCartOpen,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
      notify,
    }),
    [cart, wishlist, compare, recent, quickView, cartOpen, theme, cartCount, cartTotal],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-20 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white shadow-2xl md:bottom-8"
            exit={{ opacity: 0, y: 12 }}
            initial={{ opacity: 0, y: 12 }}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--orange)]">
              <Check size={13} />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer />
      <QuickViewModal />
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartTotal, updateQuantity, removeFromCart } = useStore();
  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            aria-label="Close cart"
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            animate={{ x: 0 }}
            className="absolute bottom-0 right-0 top-0 flex w-full max-w-md flex-col bg-[var(--surface)] text-[var(--text)] shadow-2xl"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
              <div>
                <p className="eyebrow">Your selection</p>
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
              </div>
              <button
                aria-label="Close cart"
                className="icon-button"
                onClick={() => setCartOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {!cart.length && (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto mb-4 text-[var(--muted)]" size={40} />
                    <p className="font-semibold">Your cart is empty</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">Ready for your next ride?</p>
                  </div>
                </div>
              )}
              {cart.map((item) => {
                const product = products.find((entry) => entry.id === item.productId)!;
                return (
                  <div className="flex gap-4" key={`${item.productId}-${item.size}-${item.color}`}>
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-[var(--soft)]">
                      <Image
                        alt={product.name}
                        className="object-cover"
                        fill
                        sizes="96px"
                        src={product.image}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3">
                        <p className="font-bold">{product.name}</p>
                        <button
                          aria-label={`Remove ${product.name}`}
                          onClick={() => removeFromCart(product.id)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {item.color} · Size {item.size}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-[var(--line)]">
                          <button
                            aria-label="Decrease quantity"
                            className="p-2"
                            onClick={() => updateQuantity(product.id, item.quantity - 1)}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            aria-label="Increase quantity"
                            className="p-2"
                            onClick={() => updateQuantity(product.id, item.quantity + 1)}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <p className="font-bold">${product.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-[var(--line)] p-5">
                <div className="mb-4 flex justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p className="mb-4 text-xs text-[var(--muted)]">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  className="button-primary w-full"
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                >
                  View cart & checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function QuickViewModal() {
  const { quickView: product, setQuickView, addToCart } = useStore();
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-[75] grid place-items-center p-4">
      <button
        aria-label="Close quick view"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setQuickView(null)}
      />
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="relative grid max-h-[90vh] w-full max-w-4xl overflow-y-auto bg-[var(--surface)] text-[var(--text)] md:grid-cols-2"
        initial={{ opacity: 0, scale: 0.96 }}
      >
        <button
          aria-label="Close quick view"
          className="icon-button absolute right-4 top-4 z-10 bg-[var(--surface)]"
          onClick={() => setQuickView(null)}
        >
          <X size={18} />
        </button>
        <div className="relative min-h-80 bg-[var(--soft)] md:min-h-[520px]">
          <Image
            alt={product.name}
            className="object-cover"
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            src={product.image}
          />
        </div>
        <div className="flex flex-col justify-center p-7 md:p-10">
          <p className="eyebrow">
            {product.brand} · {product.type}
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-[-0.04em]">{product.name}</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-[var(--muted)] line-through">${product.originalPrice}</span>
            )}
          </div>
          <p className="mt-6 text-sm leading-7 text-[var(--muted)]">{product.description}</p>
          <button className="button-primary mt-7" onClick={() => addToCart(product)}>
            Add to cart
          </button>
          <Link
            className="mt-4 text-center text-xs font-bold uppercase tracking-wider underline underline-offset-4"
            href={`/products/${product.slug}`}
            onClick={() => setQuickView(null)}
          >
            View full details
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
