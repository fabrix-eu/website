export function Pending() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-6" aria-busy="true" aria-live="polite">
      <div className="h-56 animate-pulse rounded-fx-xl bg-fx-violet-soft" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-64 animate-pulse rounded-fx bg-fx-panel" />
        ))}
      </div>
    </div>
  );
}
