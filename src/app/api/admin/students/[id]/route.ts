import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

const updateStudentSchema = z.object({
  collegeEmail: z.string().email().optional(),
  rollNumber: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  semester: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
  // if provided, will re-hash; otherwise keep current
  password: z.string().min(1).optional(),
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ student }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const validated = updateStudentSchema.parse(await request.json());

  const existing = await prisma.student.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Uniqueness checks for optional fields
  if (validated.collegeEmail) {
    const emailOwner = await prisma.user.findUnique({
      where: { email: validated.collegeEmail.toLowerCase() },
    });
    if (emailOwner && emailOwner.id !== existing.userId) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
  }

  if (validated.rollNumber) {
    const rollOwner = await prisma.student.findUnique({
      where: { rollNumber: validated.rollNumber },
    });
    if (rollOwner && rollOwner.id !== existing.id) {
      return NextResponse.json({ error: "Roll number already exists" }, { status: 409 });
    }
  }

  let passwordHash: string | undefined;
  if (validated.password) {
    passwordHash = await hashPassword(validated.password);
  }

  const updated = await prisma.user.update({
    where: { id: existing.userId },
    data: {
      email: validated.collegeEmail ? validated.collegeEmail.toLowerCase() : undefined,
      isActive: typeof validated.isActive === "boolean" ? validated.isActive : undefined,
      password: passwordHash,
      student: {
        update: {
          rollNumber: validated.rollNumber ?? undefined,
          department: validated.department ?? undefined,
          semester: validated.semester ?? undefined,
        },
      },
    },
    include: { student: true },
  });

  return NextResponse.json({ student: updated }, { status: 200 });
}

