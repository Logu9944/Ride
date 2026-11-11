"use client";

import { Check, ChevronDown, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { brands, helmetTypes, products } from "@/lib/products";
import { ProductCard } from "./product-card";

const colors = ["Black", "White", "Red", "Blue", "Orange", "Yellow"];
const sizes = ["S", "M", "L", "XL"];

export function CollectionPage() {
  const params = useSearchParams();
  const [filters, setFilters] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [rating, setRating] = useState(0);
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const type = params.get("type");

  // Reset state whenever the collection parameters change (e.g. navigating
  // between "Full Face" and "Modular" from the navbar), so leftover filters,
  // search text or price caps from the previous visit can't hide products.
  useEffect(() => {
    const offer = params.get("offer");
    const requestedSort = params.get("sort");
    if (type && helmetTypes.includes(type)) setFilters([type]);
    else if (offer) setFilters(["On Sale"]);
    else setFilters([]);
    setMaxPrice(50000);
    setRating(0);
    setQuery("");
    setSort(requestedSort ?? "featured");
  }, [params]);

  const heading = type && helmetTypes.includes(type) ? `${type} Helmets` : "All Helmets";

  const results = useMemo(() => {
    const chosenBrands = filters.filter((value) => brands.includes(value));
    const chosenTypes = filters.filter((value) => helmetTypes.includes(value));
    const chosenColors = filters.filter((value) => colors.includes(value));
    const chosenSizes = filters.filter((value) => sizes.includes(value));
    return products
      .filter(
        (product) =>
          (!query ||
            `${product.name} ${product.brand} ${product.type}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (!chosenBrands.length || chosenBrands.includes(product.brand)) &&
          (!chosenTypes.length || chosenTypes.includes(product.type)) &&
          (!chosenColors.length || chosenColors.some((color) => product.colors.includes(color))) &&
          (!chosenSizes.length || chosenSizes.some((size) => product.sizes.includes(size))) &&
          (!filters.includes("On Sale") || product.originalPrice) &&
          product.price <= maxPrice &&
          product.rating >= rating,
      )
      .sort((a, b) => {
        if (sort === "low") return a.price - b.price;
        if (sort === "high") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "newest")
          return Number(b.badge === "New Arrival") - Number(a.badge === "New Arrival");
        if (sort === "popular") return b.reviews - a.reviews;
        return a.id - b.id;
      });
  }, [filters, maxPrice, query, rating, sort]);

  const toggle = (value: string) =>
    setFilters((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  const clear = () => {
    setFilters([]);
    setMaxPrice(50000);
    setRating(0);
    setQuery("");
  };

  return (
    <main className="min-h-screen">
      <section className="border-b border-[var(--line)] bg-[var(--soft)]">
        <div className="page-shell py-12 md:py-20">
          <p className="eyebrow mb-3">Protection without compromise</p>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h1 className="display-title">{heading}</h1>
            <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
              Road-tested protection, refined comfort, and uncompromising performance for every kind
              of ride.
            </p>
          </div>
        </div>
      </section>
      <section className="page-shell py-8 md:py-12">
        <div className="mb-7 flex flex-col gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-12 min-w-0 items-center border border-[var(--line)] bg-[var(--surface)] px-4 sm:w-80">
            <Search size={17} className="text-[var(--muted)]" />
            <input
              aria-label="Search collection"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search this collection"
              value={query}
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery("")}>
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-[var(--muted)]">
              <strong className="text-[var(--text)]">{results.length}</strong> products
            </p>
            <button
              className="flex h-11 items-center gap-2 border border-[var(--line)] bg-[var(--surface)] px-4 text-xs font-bold lg:hidden"
              onClick={() => setFilterOpen(true)}
            >
              <Filter size={15} /> Filters{" "}
              {filters.length > 0 && <span className="text-[var(--orange)]">{filters.length}</span>}
            </button>
            <label className="relative flex items-center gap-2 text-xs text-[var(--muted)]">
              <span className="hidden sm:block">Sort:</span>
              <select
                className="appearance-none bg-transparent py-2 pr-6 font-bold text-[var(--text)] outline-none"
                onChange={(event) => setSort(event.target.value)}
                value={sort}
              >
                <option value="featured">Featured</option>
                <option value="popular">Popularity</option>
                <option value="newest">Newest</option>
                <option value="rating">Rating</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0" size={14} />
            </label>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <Filters
              clear={clear}
              filters={filters}
              maxPrice={maxPrice}
              rating={rating}
              setMaxPrice={setMaxPrice}
              setRating={setRating}
              toggle={toggle}
            />
          </aside>
          <div>
            {filters.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    className="flex items-center gap-2 bg-[var(--soft)] px-3 py-2 text-[10px] font-bold uppercase tracking-wider"
                    key={filter}
                    onClick={() => toggle(filter)}
                  >
                    {filter}
                    <X size={12} />
                  </button>
                ))}
              </div>
            )}
            {results.length ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-5 md:gap-y-12">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="grid min-h-[500px] place-items-center border border-[var(--line)] bg-[var(--surface)] text-center">
                <div>
                  <SlidersHorizontal className="mx-auto text-[var(--orange)]" size={36} />
                  <h2 className="mt-5 text-2xl font-bold">No helmets found</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Try broadening your search or filters.
                  </p>
                  <button className="button-primary mt-6" onClick={clear}>
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {filterOpen && (
        <div className="fixed inset-0 z-[65] lg:hidden">
          <button
            aria-label="Close filters"
            className="absolute inset-0 bg-black/60"
            onClick={() => setFilterOpen(false)}
          />
          <aside className="absolute inset-y-0 right-0 w-[min(90vw,390px)] overflow-y-auto bg-[var(--background)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Filters</h2>
              <button className="icon-button" onClick={() => setFilterOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <Filters
              clear={clear}
              filters={filters}
              maxPrice={maxPrice}
              rating={rating}
              setMaxPrice={setMaxPrice}
              setRating={setRating}
              toggle={toggle}
            />
            <button
              className="button-primary sticky bottom-4 mt-8 w-full"
              onClick={() => setFilterOpen(false)}
            >
              Show {results.length} products
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

function Filters({
  filters,
  toggle,
  maxPrice,
  setMaxPrice,
  rating,
  setRating,
  clear,
}: {
  filters: string[];
  toggle: (value: string) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  rating: number;
  setRating: (value: number) => void;
  clear: () => void;
}) {
  const groups = [
    ["Helmet Type", [...helmetTypes]],
    ["Brand", brands],
    ["Size", sizes],
    ["Color", colors],
    ["Offers", ["On Sale"]],
  ] as const;
  return (
    <div>
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em]">Filter by</p>
        <button
          className="text-[10px] font-bold uppercase text-[var(--muted)] underline underline-offset-4"
          onClick={clear}
        >
          Clear all
        </button>
      </div>
      {groups.map(([label, values]) => (
        <fieldset className="border-b border-[var(--line)] py-5" key={label}>
          <legend className="mb-4 text-xs font-extrabold uppercase tracking-wider">{label}</legend>
          <div className="space-y-3">
            {values.map((value) => (
              <label
                className="flex cursor-pointer items-center gap-3 text-sm text-[var(--muted)]"
                key={value}
              >
                <input
                  checked={filters.includes(value)}
                  className="peer sr-only"
                  onChange={() => toggle(value)}
                  type="checkbox"
                />
                <span className="grid h-[18px] w-[18px] place-items-center border border-[var(--line)] peer-checked:border-[var(--orange)] peer-checked:bg-[var(--orange)]">
                  <Check className="text-white" size={12} />
                </span>
                {value}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <fieldset className="border-b border-[var(--line)] py-5">
        <legend className="mb-4 text-xs font-extrabold uppercase tracking-wider">Max Price</legend>
        <input
          aria-label="Maximum price"
          className="w-full accent-[var(--orange)]"
          max="50000"
          min="13000"
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          step="2000"
          type="range"
          value={maxPrice}
        />
        <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
          <span>₹13,000</span>
          <strong className="text-[var(--text)]">₹{maxPrice.toLocaleString("en-IN")}</strong>
        </div>
      </fieldset>
      <fieldset className="py-5">
        <legend className="mb-4 text-xs font-extrabold uppercase tracking-wider">
          Minimum Rating
        </legend>
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map((value) => (
            <button
              className={`border px-2.5 py-2 text-[10px] font-bold ${rating === value ? "border-[var(--orange)] bg-[var(--orange)] text-white" : "border-[var(--line)]"}`}
              key={value}
              onClick={() => setRating(value)}
            >
              {value === 0 ? "Any" : `${value}+ ★`}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
