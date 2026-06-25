import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

const updateTeacherSchema = z.object({
  collegeEmail: z.string().email().optional(),
  serialNumber: z.string().min(1).optional(),
  designation: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(1).optional(),
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!teacher) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ teacher }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const validated = updateTeacherSchema.parse(await request.json());

  const existing = await prisma.teacher.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (validated.collegeEmail) {
    const emailOwner = await prisma.user.findUnique({
      where: { email: validated.collegeEmail.toLowerCase() },
    });
    if (emailOwner && emailOwner.id !== existing.userId) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
  }

  if (validated.serialNumber) {
    const serialOwner = await prisma.teacher.findUnique({
      where: { serialNumber: validated.serialNumber },
    });
    if (serialOwner && serialOwner.id !== existing.id) {
      return NextResponse.json({ error: "Serial number already exists" }, { status: 409 });
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
      teacher: {
        update: {
          serialNumber: validated.serialNumber ?? undefined,
          designation: validated.designation ?? undefined,
        },
      },
    },
    include: { teacher: true },
  });

  return NextResponse.json({ teacher: updated }, { status: 200 });
}

