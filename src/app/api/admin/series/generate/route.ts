import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import CourseSeries, { ICourseSeries } from "@/models/CourseSeries";
import Course from "@/models/Course";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const activeSeries = await CourseSeries.find({ isActive: true });
    let totalGenerated = 0;

    for (const series of activeSeries) {
      const generated = await generateCoursesForSeries(series);
      totalGenerated += generated;
    }

    return NextResponse.json({
      success: true,
      coursesGenerated: totalGenerated,
      seriesProcessed: activeSeries.length,
    });
  } catch (error) {
    console.error("Error generating courses:", error);
    return NextResponse.json(
      { error: "Failed to generate courses" },
      { status: 500 }
    );
  }
}

async function generateCoursesForSeries(series: ICourseSeries) {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + series.weeksAhead * 7);

  const courses = [];
  let currentDate = new Date(series.lastGeneratedDate);

  while (currentDate.getDay() !== series.dayOfWeek) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const seriesIdString = series._id.toString();

  const getNextDate = (date: Date, frequency: string): Date => {
    const next = new Date(date);
    if (frequency === "weekly") {
      next.setDate(next.getDate() + 7);
    } else if (frequency === "fortnightly") {
      next.setDate(next.getDate() + 14);
    } else if (frequency === "monthly") {
      next.setMonth(next.getMonth() + 1);
    }
    return next;
  };

  while (currentDate <= targetDate) {
    const isBlackedOut = series.blackoutPeriods.some(
      (blackout) =>
        currentDate >= blackout.start && currentDate <= blackout.end
    );

    if (!isBlackedOut) {
      const [hours, minutes] = series.time.split(":");
      const courseDate = new Date(currentDate);
      courseDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const existing = await Course.findOne({
        date: courseDate,
        location: series.location,
      });

      if (!existing) {
        courses.push({
          date: courseDate,
          location: series.location,
          spotsTotal: series.spotsTotal,
          spotsRemaining: series.spotsTotal,
          price: series.price,
          type: series.type,
          active: true,
          seriesId: seriesIdString,
        });
      }
    }

    const lastDate = new Date(currentDate);
    currentDate = getNextDate(currentDate, series.frequency || "weekly");

    if (courses.length > 0 && currentDate > targetDate) {
      await Course.insertMany(courses);
      await CourseSeries.findByIdAndUpdate(series._id, {
        lastGeneratedDate: lastDate,
      });
    }
  }

  if (courses.length > 0 && currentDate <= targetDate) {
    await Course.insertMany(courses);
  }

  return courses.length;
}
