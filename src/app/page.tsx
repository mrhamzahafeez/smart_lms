import Link from "next/link";

const highlights = [
  "Role-based dashboards for admins, teachers, and students",
  "Course-scoped learning workspaces and collaboration",
  "Ready for Clerk, Prisma, and AI-assisted study flows",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-base px-6 py-10 text-text-primary">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-center gap-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-text-muted">
            Smart Campus LMS & ERP
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
            SmartLMS
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-text-muted">
            A calm, role-aware foundation for Intermediate colleges to manage
            academics, learning workflows, communication, and future AI study
            assistance from one system.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((highlight) => (
            <div
              key={highlight}
              className="rounded-2xl border border-border-subtle bg-bg-surface p-5 text-sm leading-6 text-text-muted"
            >
              {highlight}
            </div>
          ))}
        </div>

        <nav aria-label="Public pages" className="flex flex-wrap gap-3">
          <Link
            href="/about"
            className="rounded-xl border border-border-subtle px-4 py-2 text-sm font-medium text-text-primary"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-xl bg-accent-primary px-4 py-2 text-sm font-medium text-white"
          >
            Contact
          </Link>
        </nav>
      </section>
    </main>
  );
}
