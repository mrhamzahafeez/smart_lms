import Link from "next/link";

const features = [
  "Role-based dashboards for admins, teachers, and students",
  "College learning workflows with secure authentication",
  "A foundation ready for courses and enrollments",
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
            Smart Campus LMS & ERP for Intermediate colleges (Grade 11 & 12)
            — built for secure roles, real academic workflows, and dependable
            administration.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature}

              className="rounded-2xl border border-border-subtle bg-bg-surface p-5 text-sm leading-6 text-text-muted"
            >
              {feature}

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
