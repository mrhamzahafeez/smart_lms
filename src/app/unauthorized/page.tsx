export const metadata = {
  title: "Unauthorized",
};

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base px-6 py-12 text-text-primary">
      <section className="max-w-lg rounded-2xl border border-border-subtle bg-bg-surface p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-text-muted">
          Unauthorized
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold">
          Access is not available
        </h1>
        <p className="mt-4 leading-7 text-text-muted">
          This route is reserved for future authentication and role-based access
          handling.
        </p>
      </section>
    </main>
  );
}
