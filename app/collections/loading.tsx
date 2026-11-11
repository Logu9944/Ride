export default function Loading() {
  return (
    <main className="page-shell py-20">
      <div className="skeleton h-24 w-2/3" />
      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="skeleton aspect-[4/5]" key={index} />
        ))}
      </div>
    </main>
  );
}
