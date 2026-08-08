export default function PlaceholderPage() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center rounded-lg border border-dashed text-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <span className="text-2xl">🚧</span>
        </div>
        <h2 className="mt-6 text-2xl font-semibold">Thank You For Closed Business</h2>
        <p className="mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
          Log and track revenue generated for members.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          This module is part of the broader architecture and is scheduled for a future development phase.
        </p>
      </div>
    </div>
  );
}
