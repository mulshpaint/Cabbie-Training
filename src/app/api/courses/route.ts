import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await dbConnect();

    const courses = await Course.find({ active: true })
      .sort({ type: 1, date: 1 })
      .lean();

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
