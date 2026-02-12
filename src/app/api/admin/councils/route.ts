import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Council from "@/models/Council";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const councils = await Council.find().sort({ order: 1, name: 1 }).lean();
    return NextResponse.json(councils);
  } catch (error) {
    console.error("Admin councils fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch councils" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();

    if (!body.name || !body.displayName) {
      return NextResponse.json({ error: "Name and display name are required" }, { status: 400 });
    }

    const council = await Council.create(body);
    return NextResponse.json(council, { status: 201 });
  } catch (error) {
    console.error("Create council error:", error);
    return NextResponse.json({ error: "Failed to create council" }, { status: 500 });
  }
}
