export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bg-base px-6 py-12 text-text-primary">
      <section className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-text-muted">
          Contact
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold">
          SmartLMS Pilot Coordination
        </h1>
        <p className="mt-5 leading-7 text-text-muted">
          Contact workflows will be connected in a later feature phase. This
          page exists as the public route foundation required for project setup.
        </p>
      </section>
    </main>
  );
}
