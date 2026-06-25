import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";

const createStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  collegeEmail: z.string().email(),
  rollNumber: z.string().min(1),
  department: z.string().min(1),
  semester: z.number().int().min(1),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const students = await prisma.student.findMany({
    include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ students }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = createStudentSchema.parse(body);

    // Reject duplicates (email unique, rollNumber unique)
    const existingEmail = await prisma.user.findUnique({
      where: { email: validated.collegeEmail.toLowerCase() },
    });
    if (existingEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const existingRoll = await prisma.student.findUnique({
      where: { rollNumber: validated.rollNumber },
    });
    if (existingRoll) {
      return NextResponse.json({ error: "Roll number already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(validated.rollNumber);

    const created = await prisma.user.create({
      data: {
        email: validated.collegeEmail.toLowerCase(),
        password: passwordHash,
        role: "STUDENT",
        isActive: true,
        student: {
          create: {
            rollNumber: validated.rollNumber,
            department: validated.department,
            semester: validated.semester,
          },
        },
      },
      include: { student: true },
    });

    return NextResponse.json({ student: created }, { status: 201 });
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

