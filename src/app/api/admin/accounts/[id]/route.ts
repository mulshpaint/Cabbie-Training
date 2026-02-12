import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

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

    // Prevent deleting the last admin
    const count = await Admin.countDocuments();
    if (count <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last admin account" },
        { status: 400 }
      );
    }

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete admin error:", error);
    return NextResponse.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}
