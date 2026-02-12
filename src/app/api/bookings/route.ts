import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Course from "@/models/Course";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { firstName, lastName, email, phone, council, courseId, notes } = body;

    if (!firstName || !lastName || !email || !phone || !courseId) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (course.type === "fixed" && course.spotsRemaining <= 0) {
      return NextResponse.json(
        { error: "Sorry, this course is fully booked" },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      firstName,
      lastName,
      email,
      phone,
      council: council || "Not specified",
      courseId,
      notes,
      status: "pending",
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `PAT Course — ${course.type === "flexible" ? "Flexible Date" : new Date(course.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
              description: `Passenger Assistance Training at ${course.location}`,
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        courseId: courseId,
      },
      success_url: `${baseUrl}/?booking=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?booking=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
