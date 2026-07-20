export default function Loading() {
  return (
    <main className="min-h-screen bg-light-bg px-5 py-24 font-noto" aria-busy="true">
      <div className="mx-auto max-w-3xl animate-pulse space-y-5">
        <div className="h-8 w-40 rounded bg-gray-200" />
        <div className="h-14 w-3/4 rounded bg-gray-200" />
        <div className="h-48 rounded-3xl bg-white shadow-sm" />
      </div>
    </main>
  );
}