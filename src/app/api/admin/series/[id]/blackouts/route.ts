import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import CourseSeries from "@/models/CourseSeries";
import Course from "@/models/Course";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { start, end, reason } = await req.json();

    if (!start || !end) {
      return NextResponse.json(
        { error: "Start and end dates are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const series = await CourseSeries.findById(id);
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    series.blackoutPeriods.push({
      start: new Date(start),
      end: new Date(end),
      reason,
    });

    await series.save();

    await Course.updateMany(
      {
        seriesId: id,
        date: { $gte: new Date(start), $lte: new Date(end) },
      },
      { active: false }
    );

    return NextResponse.json(series);
  } catch (error) {
    console.error("Error adding blackout period:", error);
    return NextResponse.json(
      { error: "Failed to add blackout period" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { index } = await req.json();

    if (index === undefined) {
      return NextResponse.json(
        { error: "Blackout index is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const series = await CourseSeries.findById(id);
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (index < 0 || index >= series.blackoutPeriods.length) {
      return NextResponse.json(
        { error: "Invalid blackout index" },
        { status: 400 }
      );
    }

    const removedBlackout = series.blackoutPeriods[index];
    series.blackoutPeriods.splice(index, 1);
    await series.save();

    await Course.updateMany(
      {
        seriesId: id,
        date: {
          $gte: removedBlackout.start,
          $lte: removedBlackout.end,
        },
      },
      { active: true }
    );

    return NextResponse.json(series);
  } catch (error) {
    console.error("Error removing blackout period:", error);
    return NextResponse.json(
      { error: "Failed to remove blackout period" },
      { status: 500 }
    );
  }
}
