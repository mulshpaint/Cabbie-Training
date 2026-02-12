import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { sendContactReply } from "@/lib/brevo";

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
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    await sendContactReply({
      to: contact.email,
      toName: contact.name,
      subject: `Re: ${contact.subject}`,
      replyMessage: message.trim(),
      originalMessage: contact.message,
    });

    // Mark as replied
    contact.replied = true;
    await contact.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
