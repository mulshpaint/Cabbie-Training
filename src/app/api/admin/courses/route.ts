import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const courses = await Course.find().sort({ date: 1 }).lean();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Admin courses error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();

    const course = await Course.create({
      date: body.date,
      location: body.location || "Rochford, Essex",
      spotsTotal: body.spotsTotal || 8,
      spotsRemaining: body.spotsRemaining || body.spotsTotal || 8,
      price: body.price,
      type: body.type,
      active: body.active !== false,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
