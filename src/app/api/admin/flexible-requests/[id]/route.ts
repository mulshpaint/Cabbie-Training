import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import FlexibleRequest from "@/models/FlexibleRequest";
import Course from "@/models/Course";
import Booking from "@/models/Booking";
import { getStripe } from "@/lib/stripe";
import { sendBookingLinkEmail } from "@/lib/brevo";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = await params;

    const request = await FlexibleRequest.findById(id).lean();
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error("Fetch request error:", error);
    return NextResponse.json(
      { error: "Failed to fetch request" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updated = await FlexibleRequest.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: "after" }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = await params;

    const deleted = await FlexibleRequest.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete request error:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { action, courseData } = body;

    if (action !== "sendBookingLink") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!courseData || !courseData.date || !courseData.location || !courseData.price) {
      return NextResponse.json(
        { error: "Course data is required" },
        { status: 400 }
      );
    }

    const request = await FlexibleRequest.findById(id);
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const course = await Course.create({
      date: new Date(courseData.date),
      location: courseData.location,
      spotsTotal: 1,
      spotsRemaining: 1,
      price: courseData.price,
      type: "flexible",
      active: true,
    });

    const booking = await Booking.create({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phone: request.phone,
      council: request.council,
      courseId: course._id,
      notes: request.notes,
      status: "pending",
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: request.email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `PAT Course — ${new Date(courseData.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
              description: `Passenger Assistance Training at ${courseData.location}`,
            },
            unit_amount: courseData.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        courseId: course._id.toString(),
      },
      success_url: `${baseUrl}/?booking=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?booking=cancelled`,
    });

    await sendBookingLinkEmail({
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      courseDate: new Date(courseData.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      courseLocation: courseData.location,
      price: courseData.price,
      paymentLink: session.url || "",
    });

    await FlexibleRequest.findByIdAndUpdate(id, { status: "booked" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send booking link error:", error);
    return NextResponse.json(
      { error: "Failed to send booking link" },
      { status: 500 }
    );
  }
}
