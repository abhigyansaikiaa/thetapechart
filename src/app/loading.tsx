export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-border"></div>
          <div className="absolute inset-0 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-accent animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
