import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell grid min-h-[65vh] place-items-center text-center">
      <div>
        <p className="font-[family-name:var(--font-display)] text-8xl font-black text-[var(--orange)]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase">Road not found.</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">This route has taken an unexpected turn.</p>
        <Link className="button-primary mt-7" href="/">
          Return home
        </Link>
      </div>
    </main>
  );
}
