export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-36 bg-zinc-800 rounded-md" />
      <div className="h-4 w-24 bg-zinc-800 rounded-md" />
      <div className="grid gap-4 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-zinc-900 rounded-xl border border-zinc-800" />
        ))}
      </div>
    </div>
  );
}
