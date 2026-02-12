import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Council from "@/models/Council";

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

    const council = await Council.findByIdAndUpdate(id, body, { new: true });
    if (!council) {
      return NextResponse.json({ error: "Council not found" }, { status: 404 });
    }

    return NextResponse.json(council);
  } catch (error) {
    console.error("Update council error:", error);
    return NextResponse.json({ error: "Failed to update council" }, { status: 500 });
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

    const council = await Council.findByIdAndDelete(id);
    if (!council) {
      return NextResponse.json({ error: "Council not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete council error:", error);
    return NextResponse.json({ error: "Failed to delete council" }, { status: 500 });
  }
}
