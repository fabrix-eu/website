export function Pending() {
  return (
    <div className="container mx-auto mt-12 px-8" aria-busy="true" aria-live="polite">
      <div className="h-10 w-2/3 max-w-md animate-pulse rounded-fx-sm bg-ownindigo" />
      <div className="mt-6 h-4 w-full max-w-xl animate-pulse rounded-sm bg-owncyan" />
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-48 animate-pulse rounded-3xl bg-owncyan md:h-64" />
        ))}
      </div>
    </div>
  );
}
