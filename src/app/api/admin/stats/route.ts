import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Course from "@/models/Course";
import Contact from "@/models/Contact";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalBookingsThisMonth, upcomingCourses, unreadContacts, totalDriversTrained] =
      await Promise.all([
        Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
        Course.countDocuments({ date: { $gte: now }, active: true }),
        Contact.countDocuments({ read: false }),
        Booking.countDocuments({ status: "paid" }),
      ]);

    return NextResponse.json({
      totalBookingsThisMonth,
      upcomingCourses,
      unreadContacts,
      totalDriversTrained,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
