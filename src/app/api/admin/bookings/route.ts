import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Course from "@/models/Course";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");
    const courseId = searchParams.get("courseId");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (courseId) filter.courseId = courseId;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const courseIds = [...new Set(bookings.map((b) => b.courseId?.toString()))];
    const courses = await Course.find({ _id: { $in: courseIds } }).lean();
    const courseMap = new Map(courses.map((c) => [c._id.toString(), c]));

    const enriched = bookings.map((b) => ({
      ...b,
      course: courseMap.get(b.courseId?.toString()) || null,
    }));

    return NextResponse.json({ bookings: enriched });
  } catch (error) {
    console.error("Admin bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
