"use client";

import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Gauge,
  Headphones,
  ShieldCheck,
  Star,
  Truck,
  Wind,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { helmetTypes, products } from "@/lib/products";
import { ProductRail } from "./product-card";
import { useStore } from "./store-provider";

const heroImage =
  "https://images.unsplash.com/photo-1591259966748-4e4b9916858f?auto=format&fit=crop&w=2000&q=90";

export function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  return (
    <main>
      <section
        ref={heroRef}
        className="noise relative min-h-[calc(100svh-106px)] overflow-hidden bg-[#0d0f0e] text-white"
      >
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            alt="Motorcyclist wearing a premium full-face helmet"
            className="object-cover object-[60%_center] opacity-75"
            fill
            priority
            sizes="100vw"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </motion.div>
        <motion.div
          className="page-shell relative z-10 flex min-h-[calc(100svh-106px)] items-end pb-16 pt-32 md:items-center md:pb-0"
          style={{ y: copyY }}
        >
          <div className="max-w-4xl">
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="eyebrow mb-5"
              initial={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.15 }}
            >
              Built for those who lead
            </motion.p>
            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="font-[family-name:var(--font-display)] text-[clamp(2.8rem,11vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.045em]"
              initial={{ opacity: 0, y: 45 }}
              transition={{ duration: 0.7 }}
            >
              Ride Beyond
              <br />
              <span className="text-[var(--orange)]">Limits.</span>
            </motion.h1>
            <motion.p
              animate={{ opacity: 1 }}
              className="mt-7 max-w-lg text-sm leading-7 text-white/65 sm:text-base"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
            >
              Engineered for protection. Designed for performance.
            </motion.p>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.75 }}
            >
              <Link className="button-primary" href="/collections">
                Shop collection <ArrowRight size={16} />
              </Link>
              <Link
                className="button-secondary border-white text-white hover:text-[#111312]"
                href="/collections?sort=popular"
              >
                <span>Explore best sellers</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-7 right-8 hidden items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white/50 md:flex">
          <span className="h-px w-12 bg-white/30" /> Scroll to explore
        </div>
      </section>

      <SaleCountdown />
      <CollectionTiles />
      <ProductRail
        eyebrow="Rider favorites"
        products={products.filter((product) => product.badge === "Best Seller").slice(0, 4)}
        title="Best Sellers"
      />
      <SafetyStory />
      <ProductRail
        eyebrow="Fresh from the lab"
        products={products
          .filter((product) => product.badge === "New Arrival")
          .concat(products.slice(3, 5))
          .slice(0, 4)}
        title="New Arrivals"
        href="/collections?sort=newest"
      />
      <WhyChooseUs />
      <TrustedBrands />
      <Testimonials />
      <Instagram />
      <Newsletter />
    </main>
  );
}

function SaleCountdown() {
  const [seconds, setSeconds] = useState(23 * 3600 + 47 * 60 + 19);
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return (
    <section className="bg-[var(--orange)] text-white">
      <div className="page-shell flex flex-col items-center justify-between gap-5 py-5 sm:flex-row">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em]">
            Limited time · Performance event
          </p>
          <p className="mt-1 text-lg font-black uppercase">Up to 30% off select helmets</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            [hours, "Hrs"],
            [minutes, "Min"],
            [secs, "Sec"],
          ].map(([value, label]) => (
            <div className="min-w-14 text-center" key={label}>
              <p className="font-[family-name:var(--font-display)] text-3xl font-black leading-none">
                {String(value).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-wider opacity-70">
                {label}
              </p>
            </div>
          ))}
          <Link
            className="ml-3 border-b border-white pb-1 text-[10px] font-extrabold uppercase tracking-wider"
            href="/collections?offer=true"
          >
            Shop offers
          </Link>
        </div>
      </div>
    </section>
  );
}

function CollectionTiles() {
  const images = [
    "photo-1627530980937-b8721b91506a",
    "photo-1623038868323-7d39ec58eefe",
    "photo-1571819507488-0e1dfe7cc22d",
    "photo-1701522814501-1b548c320d5a",
  ];
  return (
    <section className="page-shell py-16 md:py-24">
      <div className="mb-10">
        <p className="eyebrow mb-3">Find your form</p>
        <h2 className="section-title">Shop by helmet type</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {helmetTypes.map((type, index) => (
          <Link
            className="group relative aspect-[3/4] overflow-hidden bg-[#222]"
            href={`/collections?type=${type.replace(" ", "+")}`}
            key={type}
          >
            <Image
              alt={`${type} motorcycle helmets`}
              className="object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
              fill
              sizes="(max-width: 640px) 100vw, 25vw"
              src={`https://images.unsplash.com/${images[index]}?auto=format&fit=crop&w=900&q=85`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--orange)]">
                0{index + 1}
              </span>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-black uppercase">
                {type}
              </h3>
              <span className="mt-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider opacity-0 transition group-hover:opacity-100">
                Explore <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SafetyStory() {
  return (
    <section className="grid bg-[#111312] text-white lg:grid-cols-2">
      <div className="relative min-h-[480px] overflow-hidden">
        <Image
          alt="Close-up details of a premium motorcycle helmet"
          className="object-cover"
          fill
          sizes="(max-width:1024px) 100vw, 50vw"
          src="https://images.unsplash.com/photo-1599828020722-a4fa110ec599?auto=format&fit=crop&w=1400&q=88"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
      </div>
      <div className="flex items-center px-6 py-16 sm:px-12 lg:px-[10%]">
        <div>
          <p className="eyebrow mb-4">Protection, evolved</p>
          <h2 className="section-title">
            Built around
            <br />
            your safety.
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/55">
            Every Rideform helmet is engineered through thousands of impact simulations, wind-tunnel
            hours, and real-world road tests.
          </p>
          <div className="mt-9 grid gap-6 sm:grid-cols-2">
            {[
              [ShieldCheck, "ECE 22.06", "Latest global safety standard"],
              [Wind, "Aero tuned", "Stable at extreme speed"],
              [Gauge, "Multi-impact", "Energy-managing EPS"],
              [Headphones, "Quiet comfort", "Acoustic neck roll"],
            ].map(([Icon, title, copy]) => (
              <div className="flex gap-3" key={title as string}>
                <Icon className="shrink-0 text-[var(--orange)]" size={22} />
                <div>
                  <p className="text-sm font-bold">{title as string}</p>
                  <p className="mt-1 text-xs text-white/40">{copy as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="page-shell py-16 md:py-24" id="why">
      <div className="text-center">
        <p className="eyebrow mb-3">The Rideform standard</p>
        <h2 className="section-title">Why riders choose us</h2>
      </div>
      <div className="mt-12 grid gap-px bg-[var(--line)] md:grid-cols-4">
        {[
          [
            ShieldCheck,
            "Certified protection",
            "Every helmet meets or exceeds the newest global safety standards.",
          ],
          [Truck, "Fast free delivery", "Complimentary tracked shipping on every order over $150."],
          [
            BadgeCheck,
            "Five-year warranty",
            "Built to last and backed by our industry-leading guarantee.",
          ],
          [
            Headphones,
            "Rider support",
            "Real experts available seven days a week to help you choose.",
          ],
        ].map(([Icon, title, copy]) => (
          <div className="bg-[var(--background)] p-7 sm:p-9" key={title as string}>
            <Icon className="text-[var(--orange)]" size={28} />
            <h3 className="mt-6 font-bold">{title as string}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{copy as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustedBrands() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface)]">
      <div className="page-shell py-10">
        <p className="mb-7 text-center text-[9px] font-extrabold uppercase tracking-[0.2em] text-[var(--muted)]">
          Trusted performance partners
        </p>
        <div className="grid grid-cols-2 gap-px bg-[var(--line)] sm:grid-cols-4">
          {["APEX", "BELL", "KASK", "VEGA"].map((brand) => (
            <div
              className="bg-[var(--surface)] py-5 text-center font-[family-name:var(--font-display)] text-2xl font-black tracking-[0.08em] text-[var(--muted)] transition hover:text-[var(--orange)]"
              key={brand}
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-[var(--soft)] py-16 md:py-24">
      <div className="page-shell">
        <div className="mb-10">
          <p className="eyebrow mb-3">Road tested</p>
          <h2 className="section-title">What riders say</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "The Aero R1 is the quietest helmet I have owned. At speed it feels absolutely planted.",
              "Marcus T.",
              "Track day rider",
            ],
            [
              "The fit advice was spot on and delivery arrived the next morning. Premium from start to finish.",
              "Elena R.",
              "Touring rider",
            ],
            [
              "You can feel the quality the second you put it on. Light, balanced and beautifully finished.",
              "Sam K.",
              "Daily commuter",
            ],
          ].map(([quote, name, role]) => (
            <blockquote className="bg-[var(--surface)] p-7 md:p-9" key={name}>
              <div className="mb-6 flex text-[var(--orange)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star className="fill-current" key={i} size={14} />
                ))}
              </div>
              <p className="text-base font-semibold leading-7">“{quote}”</p>
              <footer className="mt-7 text-xs">
                <span className="font-bold">{name}</span>
                <span className="ml-2 text-[var(--muted)]">{role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Instagram() {
  const ids = [
    "photo-1591259966748-4e4b9916858f",
    "photo-1591216108746-8f7d7da8bd17",
    "photo-1569906277405-69e7e8c4a17d",
    "photo-1591259885432-ec5d63ecaa93",
    "photo-1588486624469-ad668ac8e1d8",
  ];
  return (
    <section className="py-16 md:py-24">
      <div className="page-shell mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">Ride with us</p>
          <h2 className="section-title">@Rideform</h2>
        </div>
        <span className="hidden text-xs font-bold uppercase tracking-wider text-[var(--muted)] sm:block">
          #RideBeyond
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5">
        {ids.map((id, index) => (
          <div
            className={`relative aspect-square overflow-hidden ${index === 4 ? "max-sm:hidden" : ""}`}
            key={id}
          >
            <Image
              alt="Rideform community rider"
              className="object-cover transition duration-500 hover:scale-105"
              fill
              sizes="20vw"
              src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=650&q=82`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const { notify } = useStore();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    notify("Welcome to the Rideform community");
  };
  return (
    <section className="border-y border-white/10 bg-[var(--orange)] text-white">
      <div className="page-shell grid gap-8 py-12 md:grid-cols-2 md:items-center md:py-16">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] opacity-70">
            Join the inner circle
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-black uppercase leading-none md:text-5xl">
            Get 10% off your first ride.
          </h2>
        </div>
        <form className="flex border-b-2 border-white" onSubmit={submit}>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            className="h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/60"
            id="newsletter-email"
            placeholder="Enter your email address"
            required
            type="email"
          />
          <button
            className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider"
            type="submit"
          >
            Subscribe <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
