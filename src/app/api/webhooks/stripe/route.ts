import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Course from "@/models/Course";
import { sendBookingConfirmation } from "@/lib/brevo";
import { format } from "date-fns";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    const courseId = session.metadata?.courseId;

    if (bookingId) {
      try {
        await dbConnect();

        // Stripe can retry webhooks and/or deliver duplicates. Only process once.
        const booking = await Booking.findOneAndUpdate(
          { _id: bookingId, status: { $ne: "paid" } },
          {
            status: "paid",
            stripeSessionId: session.id,
          },
          { new: true }
        );

        // If booking is already marked paid, do not decrement spots or re-send emails.
        if (!booking) {
          return NextResponse.json({ received: true });
        }

        if (courseId) {
          const course = await Course.findById(courseId);
          if (course && course.type === "fixed") {
            await Course.findByIdAndUpdate(courseId, {
              $inc: { spotsRemaining: -1 },
            });
          }

          if (booking && course) {
            try {
              await sendBookingConfirmation({
                firstName: booking.firstName,
                lastName: booking.lastName,
                email: booking.email,
                courseDate:
                  course.type === "flexible"
                    ? "Flexible — we'll contact you"
                    : format(new Date(course.date), "d MMMM yyyy"),
                courseLocation: course.location,
                price: course.price,
              });
            } catch (emailError) {
              console.error("Failed to send confirmation email:", emailError);
            }
          }
        }
      } catch (dbError) {
        console.error("Failed to update booking:", dbError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
