"use client";

import { useEffect, useMemo, useState } from "react";

import type { UserRole } from "@/types/auth";

type Student = {
  id: string;
  userId: string;
  rollNumber: string;
  department: string;
  semester: number;
  createdAt: string;
  updatedAt: string;
};

type StudentWithUser = {
  id: string;
  userId: string;
  rollNumber: string;
  department: string;
  semester: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    isActive: boolean;
  };
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/students", { method: "GET" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load students");
        if (!alive) return;
        setStudents(data.students || []);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load students");
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
        rollNumber: string;
        department: string;
        semester: number;
      }) => {
        const res = await fetch("/api/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to create student");
        return data.student;
      },
      update: async (id: string, payload: {
        collegeEmail?: string;
        rollNumber?: string;
        department?: string;
        semester?: number;
        isActive?: boolean;
        password?: string;
      }) => {
        const res = await fetch(`/api/admin/students/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to update student");
        return data.student;
      },
    }),
    [],
  );

  async function handleActivate(student: StudentWithUser, active: boolean) {
    try {
      setError(null);
      const updated = await api.update(student.id, {
        isActive: active,
      });
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? ({ ...s, ...updated, user: updated.user } as any) : s,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Student Management</h1>

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
                <th className="px-4 py-3 font-medium">Roll #</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Semester</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-border-subtle">
                  <td className="px-4 py-3">{s.user.email}</td>
                  <td className="px-4 py-3">{s.rollNumber}</td>
                  <td className="px-4 py-3">{s.department}</td>
                  <td className="px-4 py-3">{s.semester}</td>
                  <td className="px-4 py-3">{s.user.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-4 py-3">
                    {s.user.isActive ? (
                      <button
                        onClick={() => handleActivate(s, false)}
                        className="rounded-lg bg-accent-primary/10 px-3 py-1 text-xs font-medium text-accent-primary hover:bg-accent-primary/20"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(s, true)}
                        className="rounded-lg bg-accent-primary px-3 py-1 text-xs font-medium text-white hover:bg-accent-primary/90"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-text-muted" colSpan={6}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <section className="mt-6 rounded-xl border border-border-subtle bg-bg-surface p-4">
        <h2 className="text-lg font-semibold">Create Student</h2>
        <p className="mt-1 text-sm text-text-muted">
          Initial password will be set to Roll Number.
        </p>

        <CreateStudentForm
          onCreate={async (payload) => {
            const created = await api.create(payload);
            setStudents((prev) => [created as any, ...prev]);
          }}
        />
      </section>
    </main>
  );
}

function CreateStudentForm({
  onCreate,
}: {
  onCreate: (payload: {
    firstName: string;
    lastName: string;
    collegeEmail: string;
    rollNumber: string;
    department: string;
    semester: number;
  }) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState<number>(1);
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
        rollNumber,
        department,
        semester,
      });
      setFirstName("");
      setLastName("");
      setCollegeEmail("");
      setRollNumber("");
      setDepartment("");
      setSemester(1);
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
        <span className="block text-xs font-medium text-text-muted">Roll number</span>
        <input
          className="mt-1 w-full rounded-lg border border-border-subtle bg-bg-base px-3 py-2 text-sm"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
      </label>

      <label>
        <span className="block text-xs font-medium text-text-muted">Semester</span>
        <input
          className="mt-1 w-full rounded-lg border border-border-subtle bg-bg-base px-3 py-2 text-sm"
          value={semester}
          onChange={(e) => setSemester(parseInt(e.target.value || "1", 10))}
          type="number"
          min={1}
        />
      </label>

      <label className="md:col-span-2">
        <span className="block text-xs font-medium text-text-muted">Department</span>
        <input
          className="mt-1 w-full rounded-lg border border-border-subtle bg-bg-base px-3 py-2 text-sm"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </label>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white hover:bg-accent-primary/90 disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create Student"}
        </button>
      </div>
    </form>
  );
}

