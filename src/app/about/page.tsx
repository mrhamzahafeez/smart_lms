export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg-base px-6 py-12 text-text-primary">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-text-muted">
          About
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold">SmartLMS</h1>
        <p className="mt-5 leading-7 text-text-muted">
          SmartLMS is the foundation for an AI-powered learning management and
          campus operations platform built for Intermediate colleges. This setup
          phase prepares the application for future database, authentication,
          dashboard, and AI integrations.
        </p>
      </section>
    </main>
  );
}
