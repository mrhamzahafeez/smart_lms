import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const [
    userCounts,
    activeUsersCount,
    inactiveUsersCount,
    courseCount,
    studentCount,
    teacherCount,
  ] = await Promise.all([
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.course.count(),
    prisma.student.count(),
    prisma.teacher.count(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-sm text-text-muted">Active Users</p>
          <p className="mt-2 text-3xl font-semibold">{activeUsersCount}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-sm text-text-muted">Inactive Users</p>
          <p className="mt-2 text-3xl font-semibold">{inactiveUsersCount}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-4">
          <p className="text-sm text-text-muted">Courses</p>
          <p className="mt-2 text-3xl font-semibold">{courseCount}</p>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border-subtle bg-bg-surface p-4">
        <h2 className="text-lg font-semibold">User Statistics</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-sm text-text-muted">Students</p>
            <p className="mt-1 text-2xl font-semibold">{studentCount}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Teachers</p>
            <p className="mt-1 text-2xl font-semibold">{teacherCount}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Admins</p>
            <p className="mt-1 text-2xl font-semibold">
              {userCounts.find((r) => r.role === "ADMIN")?._count._all ?? 0}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

