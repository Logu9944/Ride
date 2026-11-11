export default function Loading() {
  return (
    <main className="page-shell grid gap-10 py-14 lg:grid-cols-2">
      <div className="skeleton aspect-[4/4.6]" />
      <div className="space-y-5 py-8">
        <div className="skeleton h-5 w-1/3" />
        <div className="skeleton h-28 w-full" />
        <div className="skeleton h-8 w-1/3" />
        <div className="skeleton h-32 w-full" />
        <div className="skeleton h-14 w-full" />
      </div>
    </main>
  );
}
