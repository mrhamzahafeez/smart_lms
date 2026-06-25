"use client";

import { useEffect, useMemo, useState } from "react";

import type { UserRole } from "@/types/auth";

type Teacher = {
  id: string;
  userId: string;
  serialNumber: string;
  designation: string;
  createdAt: string;
  updatedAt: string;
};

type TeacherWithUser = {
  id: string;
  userId: string;
  serialNumber: string;
  designation: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  };
};

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherWithUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/teachers", { method: "GET" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load teachers");
        if (!alive) return;
        setTeachers(data.teachers || []);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load teachers");
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const api = useMemo(
    () => ({
      create: async (payload: {
        firstName: string;
        lastName: string;
        collegeEmail: string;
        serialNumber: string;
        designation: string;
      }) => {
        const res = await fetch("/api/admin/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to create teacher");
        return data.teacher;
      },
      update: async (id: string, payload: {
        collegeEmail?: string;
        serialNumber?: string;
        designation?: string;
        isActive?: boolean;
        password?: string;
      }) => {
        const res = await fetch(`/api/admin/teachers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to update teacher");
        return data.teacher;
      },
    }),
    [],
  );

  async function handleActivate(teacher: TeacherWithUser, active: boolean) {
    try {
      setError(null);
      const updated = await api.update(teacher.id, {
        isActive: active,
      });
      setTeachers((prev) =>
        prev.map((s) =>
          s.id === teacher.id ? ({ ...s, ...updated, user: updated.user } as any) : s,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Teacher Management</h1>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {isLoading ? (
        <p className="mt-4 text-sm text-text-muted">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border-subtle">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Serial #</th>
                <th className="px-4 py-3 font-medium">Designation</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id} className="border-b border-border-subtle">
                  <td className="px-4 py-3">{t.user.email}</td>
                  <td className="px-4 py-3">{t.serialNumber}</td>
                  <td className="px-4 py-3">{t.designation}</td>
                  <td className="px-4 py-3">{t.user.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    {t.user.isActive ? (
                      <button
                        onClick={() => handleActivate(t, false)}
                        className="rounded-lg bg-accent-primary/10 px-3 py-1 text-xs font-medium text-accent-primary hover:bg-accent-primary/20"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(t, true)}
                        className="rounded-lg bg-accent-primary px-3 py-1 text-xs font-medium text-white hover:bg-accent-primary/90"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-text-muted" colSpan={5}>
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-6 rounded-xl border border-border-subtle bg-bg-surface p-4">
        <h2 className="text-lg font-semibold">Create Teacher</h2>
        <p className="mt-1 text-sm text-text-muted">
          Initial password will be set to Serial Number.
        </p>

        <CreateTeacherForm
          onCreate={async (payload) => {
            const created = await api.create(payload);
            setTeachers((prev) => [created as any, ...prev]);
          }}
        />
      </section>
    </main>
  );
}

function CreateTeacherForm({
  onCreate,
}: {
  onCreate: (payload: {
    firstName: string;
    lastName: string;
    collegeEmail: string;
    serialNumber: string;
    designation: string;
  }) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onCreate({
        firstName,
        lastName,
        collegeEmail,
        serialNumber,
        designation,
      });
      setFirstName("");
      setLastName("");
      setCollegeEmail("");
      setSerialNumber("");
      setDesignation("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
      {error && (
        <div className="md:col-span-2 rounded-md bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <label className="md:col-span-1">
        <span className="block text-xs font-medium text-text-muted">First name</span>
        <input
          className="mt-1 w-full rounded-lg border border-border-subtle bg-bg-base px-3 py-2 text-sm"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>

      <label className="md:col-span-1">
        <span className="block text-xs font-medium text-text-muted">Last name</span>
        <input
          className="mt-1 w-full rounded-lg border border-border-subtle bg-bg-base px-3 py-2 text-sm"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>

      <label className="md:col-span-2">
        <span className="block text-xs font-medium text-text-muted">College email</span>
        <input
          className="mt-1 w-full rounded-lg border border-border-subtle bg-bg-base px-3 py-2 text-sm"
          value={collegeEmail}
          onChange={(e) => setCollegeEmail(e.target.value)}
          type="email"
        />
      </label>

      <label>
        <span className="block text-xs font-medium text-text-muted">Serial number</span>
        <input
          className="mt-1 w-full rounded-lg border border-border-subtle bg-bg-base px-3 py-2 text-sm"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />
      </label>

      <label className="md:col-span-1">
        <span className="block text-xs font-medium text-text-muted">Designation</span>
        <input
          className="mt-1 w-full rounded-lg border border-border-subtle bg-bg-base px-3 py-2 text-sm"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />
      </label>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white hover:bg-accent-primary/90 disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create Teacher"}
        </button>
      </div>
    </form>
  );
}

