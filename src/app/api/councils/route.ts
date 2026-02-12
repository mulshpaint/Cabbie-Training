import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Council from "@/models/Council";

export async function GET() {
  try {
    await dbConnect();
    const councils = await Council.find({ active: true })
      .sort({ order: 1, name: 1 })
      .lean();
    return NextResponse.json(councils);
  } catch (error) {
    console.error("Councils fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
