import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import CourseSeries, { ICourseSeries } from "@/models/CourseSeries";
import Course from "@/models/Course";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const series = await CourseSeries.find().sort({ dayOfWeek: 1, time: 1 });
    return NextResponse.json(series);
  } catch (error) {
    console.error("Error fetching series:", error);
    return NextResponse.json(
      { error: "Failed to fetch series" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      dayOfWeek,
      time,
      location,
      spotsTotal,
      price,
      type,
      weeksAhead,
      startDate,
    } = body;

    if (
      dayOfWeek === undefined ||
      !time ||
      !location ||
      !spotsTotal ||
      !price ||
      !type
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const series = await CourseSeries.create({
      dayOfWeek,
      time,
      location,
      spotsTotal,
      price,
      type,
      weeksAhead: weeksAhead || 8,
      isActive: true,
      blackoutPeriods: [],
      lastGeneratedDate: new Date(startDate || Date.now()),
    });

    const generatedCourses = await generateCoursesForSeries(series);

    return NextResponse.json({ series, coursesCreated: generatedCourses }, { status: 201 });
  } catch (error) {
    console.error("Error creating series:", error);
    return NextResponse.json(
      { error: "Failed to create series" },
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
