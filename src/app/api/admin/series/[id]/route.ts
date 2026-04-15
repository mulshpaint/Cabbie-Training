import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import CourseSeries from "@/models/CourseSeries";
import Course from "@/models/Course";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    await dbConnect();

    const series = await CourseSeries.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (body.location !== undefined || body.spotsTotal !== undefined || body.price !== undefined || body.type !== undefined || body.time !== undefined) {
      await Course.updateMany(
        {
          seriesId: id,
          $expr: { $eq: ["$spotsRemaining", "$spotsTotal"] },
          date: { $gte: new Date() },
        },
        {
          ...(body.location && { location: body.location }),
          ...(body.spotsTotal && { spotsTotal: body.spotsTotal, spotsRemaining: body.spotsTotal }),
          ...(body.price && { price: body.price }),
          ...(body.type && { type: body.type }),
        }
      );
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error("Error updating series:", error);
    return NextResponse.json(
      { error: "Failed to update series" },
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
    const { deleteFutureCourses } = await req.json();

    await dbConnect();

    const series = await CourseSeries.findByIdAndDelete(id);

    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }

    if (deleteFutureCourses) {
      await Course.deleteMany({
        seriesId: id,
        date: { $gte: new Date() },
        $expr: { $eq: ["$spotsRemaining", "$spotsTotal"] },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting series:", error);
    return NextResponse.json(
      { error: "Failed to delete series" },
      { status: 500 }
    );
  }
}
