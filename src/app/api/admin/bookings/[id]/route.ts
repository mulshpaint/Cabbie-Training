import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Course from "@/models/Course";
import { getStripe } from "@/lib/stripe";
import { sendBookingCancellation, sendRefundConfirmation } from "@/lib/brevo";
import { format } from "date-fns";

async function getCourseDetails(courseId: string) {
  const course = await Course.findById(courseId).lean();
  if (!course) return { courseDate: "TBC", courseTime: "", courseLocation: "TBC", price: 0 };
  const d = new Date(course.date);
  return {
    courseDate:
      course.type === "flexible"
        ? "Flexible — we'll contact you"
        : format(d, "d MMMM yyyy"),
    courseTime: course.type === "flexible" ? "" : format(d, "HH:mm"),
    courseLocation: course.location,
    price: course.price,
  };
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

    const previousBooking = await Booking.findById(id);
    const booking = await Booking.findByIdAndUpdate(id, body, { new: true });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Send cancellation email if status changed to cancelled
    if (body.status === "cancelled" && previousBooking?.status !== "cancelled") {
      try {
        const courseDetails = await getCourseDetails(booking.courseId?.toString());
        await sendBookingCancellation({
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email,
          ...courseDetails,
        });
      } catch (emailError) {
        console.error("Failed to send cancellation email:", emailError);
      }
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
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

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Restore the course spot if booking was active (not cancelled)
    if (booking.status !== "cancelled" && booking.courseId) {
      await Course.findByIdAndUpdate(booking.courseId, {
        $inc: { spotsRemaining: 1 },
      });
    }

    await Booking.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
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
    const { action } = await req.json();

    if (action !== "refund") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (!booking.stripeSessionId) {
      return NextResponse.json(
        { error: "No Stripe payment found for this booking" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Retrieve the checkout session to get the payment intent
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      booking.stripeSessionId
    );

    if (!checkoutSession.payment_intent) {
      return NextResponse.json(
        { error: "No payment intent found for this session" },
        { status: 400 }
      );
    }

    const paymentIntentId =
      typeof checkoutSession.payment_intent === "string"
        ? checkoutSession.payment_intent
        : checkoutSession.payment_intent.id;

    // Issue full refund
    await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    // Update booking status to refunded
    booking.status = "refunded";
    await booking.save();

    // Restore course spot
    if (booking.courseId) {
      await Course.findByIdAndUpdate(booking.courseId, {
        $inc: { spotsRemaining: 1 },
      });
    }

    // Send refund confirmation email
    try {
      const courseDetails = await getCourseDetails(booking.courseId?.toString());
      await sendRefundConfirmation({
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        ...courseDetails,
      });
    } catch (emailError) {
      console.error("Failed to send refund email:", emailError);
    }

    return NextResponse.json({ success: true, status: "refunded" });
  } catch (error) {
    console.error("Refund error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process refund";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
