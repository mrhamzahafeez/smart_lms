import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

const createTeacherSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  collegeEmail: z.string().email(),
  serialNumber: z.string().min(1),
  designation: z.string().min(1),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const teachers = await prisma.teacher.findMany({
    include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ teachers }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = createTeacherSchema.parse(body);

    const existingEmail = await prisma.user.findUnique({
      where: { email: validated.collegeEmail.toLowerCase() },
    });
    if (existingEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const existingSerial = await prisma.teacher.findUnique({
      where: { serialNumber: validated.serialNumber },
    });
    if (existingSerial) {
      return NextResponse.json({ error: "Serial number already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(validated.serialNumber);

    const created = await prisma.user.create({
      data: {
        email: validated.collegeEmail.toLowerCase(),
        password: passwordHash,
        role: "TEACHER",
        isActive: true,
        teacher: {
          create: {
            serialNumber: validated.serialNumber,
            designation: validated.designation,
          },
        },
      },
      include: { teacher: true },
    });

    return NextResponse.json({ teacher: created }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

