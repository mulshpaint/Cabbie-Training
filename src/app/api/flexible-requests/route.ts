import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FlexibleRequest from "@/models/FlexibleRequest";
import { sendFlexibleRequestConfirmation, sendFlexibleRequestNotification } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { firstName, lastName, email, phone, council, preferredDates, notes } = body;

    if (!firstName || !lastName || !email || !phone || !council || !preferredDates) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const request = await FlexibleRequest.create({
      firstName,
      lastName,
      email,
      phone,
      council,
      preferredDates,
      notes,
      status: "pending",
    });

    try {
      await sendFlexibleRequestConfirmation({
        firstName,
        lastName,
        email,
      });

      await sendFlexibleRequestNotification({
        name: `${firstName} ${lastName}`,
        email,
        phone,
        council,
        preferredDates,
        notes: notes || "None",
      });
    } catch (emailError) {
      console.error("Failed to send flexible request emails:", emailError);
    }

    return NextResponse.json({ success: true, requestId: request._id });
  } catch (error) {
    console.error("Flexible request error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
